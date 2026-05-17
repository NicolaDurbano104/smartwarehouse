from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Movement, Item
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/predictions', methods=['GET'])
@jwt_required()
def get_predictions():
    items = Item.query.all()
    predictions = []

    for item in items:
        # Prendi tutti i movimenti di uscita dell'articolo
        movements = Movement.query.filter_by(item_id=item.id).filter(
            Movement.quantity_delta < 0
        ).order_by(Movement.timestamp.asc()).all()

        if len(movements) < 2:
            # Dati insufficienti per fare una previsione
            predictions.append({
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'min_threshold': item.min_threshold,
                'unit': item.unit,
                'days_until_empty': None,
                'avg_daily_consumption': None,
                'status': 'insufficient_data'
            })
            continue

        # Calcola il consumo medio giornaliero
        df = pd.DataFrame([{
            'date': m.timestamp.date(),
            'consumed': abs(m.quantity_delta)
        } for m in movements])

        df_grouped = df.groupby('date')['consumed'].sum().reset_index()
        avg_daily = df_grouped['consumed'].mean()

        if avg_daily <= 0:
            predictions.append({
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'min_threshold': item.min_threshold,
                'unit': item.unit,
                'days_until_empty': None,
                'avg_daily_consumption': 0,
                'status': 'no_consumption'
            })
            continue

        # Prevedi i giorni mancanti all'esaurimento
        days_until_empty = int(item.quantity / avg_daily)

        # Determina lo stato
        if item.quantity == 0:
            status = 'empty'
        elif days_until_empty <= 7:
            status = 'critical'
        elif days_until_empty <= 30:
            status = 'warning'
        else:
            status = 'ok'

        predictions.append({
            'id': item.id,
            'name': item.name,
            'quantity': item.quantity,
            'min_threshold': item.min_threshold,
            'unit': item.unit,
            'days_until_empty': days_until_empty,
            'avg_daily_consumption': round(avg_daily, 2),
            'status': status
        })

    return jsonify(predictions), 200
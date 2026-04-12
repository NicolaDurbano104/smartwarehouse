from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models import db, Movement, Item

movements_bp = Blueprint('movements', __name__)

# Lista movimenti (tutti o per articolo)
@movements_bp.route('/api/movements', methods=['GET'])
@jwt_required()
def get_movements():
    item_id = request.args.get('item_id')
    if item_id:
        movements = Movement.query.filter_by(item_id=item_id).order_by(Movement.timestamp.desc()).all()
    else:
        movements = Movement.query.order_by(Movement.timestamp.desc()).all()
    return jsonify([m.to_dict() for m in movements]), 200

# Registra un movimento
@movements_bp.route('/api/movements', methods=['POST'])
@jwt_required()
def create_movement():
    claims = get_jwt()
    if claims.get('role') == 'viewer':
        return jsonify({'error': 'Non autorizzato'}), 403

    data = request.get_json()
    item = Item.query.get_or_404(data['item_id'])

    # Calcola il delta in base al tipo
    delta = abs(data['quantity']) if data['type'] == 'IN' else -abs(data['quantity'])

    # Controlla che non vada sotto zero
    if item.quantity + delta < 0:
        return jsonify({'error': 'Quantità insufficiente in magazzino'}), 400

    # Aggiorna la quantità dell'articolo
    item.quantity += delta

    # Crea il movimento
    movement = Movement(
        item_id=item.id,
        user_id=int(get_jwt_identity()),
        quantity_delta=delta,
        type=data['type'],
        note=data.get('note', '')
    )

    db.session.add(movement)
    db.session.commit()
    return jsonify(movement.to_dict()), 201
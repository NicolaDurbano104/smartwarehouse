from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Item

items_bp = Blueprint('items', __name__)

@items_bp.route('/api/items', methods=['GET'])
@jwt_required()
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200
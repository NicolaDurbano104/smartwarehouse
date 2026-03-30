from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Item

items_bp = Blueprint('items', __name__)

# Lista tutti gli articoli
@items_bp.route('/api/items', methods=['GET'])
@jwt_required()
def get_items():
    items = Item.query.all()
    return jsonify([i.to_dict() for i in items]), 200

# Crea nuovo articolo (admin e magazziniere)
@items_bp.route('/api/items', methods=['POST'])
@jwt_required()
def create_item():
    claims = get_jwt()
    if claims.get('role') == 'viewer':
        return jsonify({'error': 'Non autorizzato'}), 403
    data = request.get_json()
    item = Item(
        name=data['name'],
        description=data.get('description', ''),
        category_id=data['category_id'],
        quantity=data.get('quantity', 0),
        min_threshold=data.get('min_threshold', 5),
        unit=data.get('unit', 'pezzi')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

# Modifica articolo (admin e magazziniere)
@items_bp.route('/api/items/<int:id>', methods=['PUT'])
@jwt_required()
def update_item(id):
    claims = get_jwt()
    if claims.get('role') == 'viewer':
        return jsonify({'error': 'Non autorizzato'}), 403
    item = Item.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        item.name = data['name']
    if 'description' in data:
        item.description = data['description']
    if 'category_id' in data:
        item.category_id = data['category_id']
    if 'quantity' in data:
        item.quantity = data['quantity']
    if 'min_threshold' in data:
        item.min_threshold = data['min_threshold']
    if 'unit' in data:
        item.unit = data['unit']
    db.session.commit()
    return jsonify(item.to_dict()), 200

# Elimina articolo (solo admin)
@items_bp.route('/api/items/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_item(id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    item = Item.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Articolo eliminato'}), 200
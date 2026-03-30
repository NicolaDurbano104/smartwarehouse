from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Category

categories_bp = Blueprint('categories', __name__)

# Lista tutte le categorie
@categories_bp.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

# Crea nuova categoria (solo admin)
@categories_bp.route('/api/categories', methods=['POST'])
@jwt_required()
def create_category():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    data = request.get_json()
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Categoria già esistente'}), 400
    category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

# Modifica categoria (solo admin)
@categories_bp.route('/api/categories/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    category = Category.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        category.name = data['name']
    if 'description' in data:
        category.description = data['description']
    db.session.commit()
    return jsonify(category.to_dict()), 201

# Elimina categoria (solo admin)
@categories_bp.route('/api/categories/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Categoria eliminata'}), 200
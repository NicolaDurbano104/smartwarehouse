from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from models import db, User

users_bp = Blueprint('users', __name__)

# Lista tutti gli utenti (solo admin)
@users_bp.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

# Crea nuovo utente (solo admin)
@users_bp.route('/api/users', methods=['POST'])
@jwt_required()
def create_user():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username già esistente'}), 400
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'viewer')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# Modifica utente (solo admin)
@users_bp.route('/api/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    user = User.query.get_or_404(id)
    data = request.get_json()
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict()), 200

# Elimina utente (solo admin)
@users_bp.route('/api/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Utente eliminato'}), 200
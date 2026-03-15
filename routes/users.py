from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Non autorizzato'}), 403

    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200
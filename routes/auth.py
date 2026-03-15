from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username e password obbligatori'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Credenziali non valide'}), 401

    # Identity deve essere stringa — usiamo l'id
    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role, 'username': user.username}
    )

    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200
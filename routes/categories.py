from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories]), 200
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='viewer')  # admin / magazziniere / viewer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relazione con movements
    movements = db.relationship('Movement', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255))

    # Relazione con items
    items = db.relationship('Item', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    min_threshold = db.Column(db.Integer, default=5)
    unit = db.Column(db.String(30), default='pezzi')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relazione con movements
    movements = db.relationship('Movement', backref='item', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category_id': self.category_id,
            'category': self.category.name if self.category else None,
            'quantity': self.quantity,
            'min_threshold': self.min_threshold,
            'unit': self.unit,
            'created_at': self.created_at.isoformat()
        }


class Movement(db.Model):
    __tablename__ = 'movements'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quantity_delta = db.Column(db.Integer, nullable=False)  # + entrata / - uscita
    type = db.Column(db.String(10), nullable=False)  # IN / OUT
    note = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'item': self.item.name if self.item else None,
            'user_id': self.user_id,
            'user': self.user.username if self.user else None,
            'quantity_delta': self.quantity_delta,
            'type': self.type,
            'note': self.note,
            'timestamp': self.timestamp.isoformat()
        }
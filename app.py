from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from models import db, User

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inizializza le estensioni
    db.init_app(app)
    JWTManager(app)
    CORS(app)

    # Crea le tabelle del database se non esistono
    with app.app_context():
        db.create_all()
        crea_admin(app)

    return app

def crea_admin(app):
    # Crea il primo utente admin se non esiste
    with app.app_context():
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@scuola.it',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✅ Utente admin creato!")

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
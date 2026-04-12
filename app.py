from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from models import db, User, Category, Item

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inizializza le estensioni
    db.init_app(app)
    JWTManager(app)
    CORS(app)

    from routes.auth import auth_bp
    from routes.items import items_bp
    from routes.categories import categories_bp
    from routes.users import users_bp
    from routes.movements import movements_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(items_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(movements_bp)

    # Crea le tabelle del database se non esistono
    with app.app_context():
        db.create_all()
        crea_admin()

    return app

def crea_admin():
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@scuola.it',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)

        cat1 = Category(name='Cancelleria', description='Penne, matite, carta...')
        cat2 = Category(name='Informatica', description='Mouse, cavi, toner...')
        cat3 = Category(name='Pulizia', description='Detergenti, spugne...')
        cat4 = Category(name='Laboratorio', description='Guanti, pipette...')
        db.session.add_all([cat1, cat2, cat3, cat4])
        db.session.flush()

        db.session.add_all([
            Item(name='Carta A4', quantity=450, min_threshold=50, unit='fogli', category_id=cat1.id),
            Item(name='Penne BIC', quantity=8, min_threshold=20, unit='pz', category_id=cat1.id),
            Item(name='Toner HP', quantity=2, min_threshold=3, unit='pz', category_id=cat2.id),
            Item(name='Mouse USB', quantity=12, min_threshold=5, unit='pz', category_id=cat2.id),
            Item(name='Detergente', quantity=0, min_threshold=5, unit='litri', category_id=cat3.id),
            Item(name='Guanti latex', quantity=60, min_threshold=15, unit='paia', category_id=cat4.id),
        ])

        db.session.commit()
        print("✅ Dati di esempio creati!")

    if not User.query.filter_by(username='mario').first():
        mario = User(
            username='mario',
            email='mario@scuola.it',
            role='magazziniere'
        )
        mario.set_password('mario123')
        db.session.add(mario)
        db.session.commit()
        print("✅ Utente mario creato!")

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
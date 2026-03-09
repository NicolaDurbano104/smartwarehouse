import os
from dotenv import load_dotenv

load_dotenv()  # legge il file .env

class Config:
    # Chiavi segrete prese dal .env
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    # Database SQLite
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASEDIR, 'magazzino.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Durata token JWT (24 ore)
    JWT_ACCESS_TOKEN_EXPIRES = 86400
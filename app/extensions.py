from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_admin import Admin
from flask_bcrypt import Bcrypt
from flask_mailman import Mail
from flask_jwt_extended import JWTManager

api = Api()
db = SQLAlchemy()
admin = Admin()
bcrypt = Bcrypt()
mail = Mail()
jwt = JWTManager()
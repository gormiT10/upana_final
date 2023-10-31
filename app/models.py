from .extensions import db,admin
from sqlalchemy import text

pacientes_registrados = db.Table(
  'pacientes_registrados',
  db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key = True),
  db.Column('paciente_id', db.Integer, db.ForeignKey('paciente.id'),primary_key = True)
)

class Usuario(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  es_admin = db.Column(db.Boolean, nullable = False, default = False)
  nombre = db.Column(db.String(100), nullable = False)
  correo = db.Column(db.String(50), default = 'do not fill this out')
  contrasena = db.Column(db.String(200), default = 'do not fill this out')
  especialidad = db.Column(db.String(50), nullable = False)# Ortopedia, ginecologia
  puesto = db.Column(db.String(30), nullable = False)#especialista, enfermero#secretaria,Farmacéutico
  pacientes = db.relationship('Paciente', secondary = pacientes_registrados, back_populates = 'especialistas')

class Paciente(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  nombre = db.Column(db.String(100), nullable = False)
  especialistas = db.relationship('Usuario', secondary = pacientes_registrados, back_populates = 'pacientes')
  atendido = db.Column(db.Boolean, default=False)



from .extensions import db,admin
from datetime import datetime

# helper table para la relacion de many to many entre pacientes y especialistas
pacientes_registrados = db.Table(
  'pacientes_registrados',
  db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key = True),
  db.Column('paciente_id', db.Integer, db.ForeignKey('paciente.id'),primary_key = True)
)

# nuestra tabla de usuarios en la db
class Usuario(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  es_admin = db.Column(db.Boolean, nullable = False, default = False)
  nombre = db.Column(db.String(100), nullable = False)
  correo = db.Column(db.String(50), default = 'do not fill this out')
  contrasena = db.Column(db.String(200), default = 'do not fill this out')
  horario_laboral = db.Column(db.String(50), nullable = False)
  especialidad = db.Column(db.String(50), nullable = False)# Ortopedia, ginecologia
  puesto = db.Column(db.String(30), nullable = False)#especialista, enfermero#secretaria,Farmacéutico
  pacientes = db.relationship('Paciente', secondary = pacientes_registrados, back_populates = 'especialistas')
  examen_orina = db.relationship("ExamenOrina", backref='especialista')
  examen_sangre = db.relationship("ExamenSangre", backref='especialista')
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __repr__(self):
    return self.nombre

# nuestra tabla paciente en db
class Paciente(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  nombre = db.Column(db.String(100), nullable = False)
  especialistas = db.relationship('Usuario', secondary = pacientes_registrados, back_populates = 'pacientes')
  atendido = db.Column(db.Boolean, default=False)
  anamnesis = db.relationship("Anamnesis", backref = 'paciente')
  examen_orina = db.relationship("ExamenOrina", backref='paciente')
  proceso = db.Column(db.String(50), nullable = False, default= 'en-sala')
  examen_sangre = db.relationship("ExamenSangre", backref='paciente')
  diagnostico = db.relationship('Diagnostico', backref='paciente' )
  medicacion = db.relationship('Medicacion', backref= 'paciente')
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)
  
  def __repr__(self):
    return self.nombre


class ExamenOrina(db.Model):
  id = db.Column(db.Integer, primary_key= True)
  nombre = db.Column(db.String(75),default='orina')
  status = db.Column(db.String(50), nullable=False, default='no-completado')
  aspecto = db.Column(db.String(100), nullable=False, default='?')
  color = db.Column(db.String(100), nullable = False, default = '-')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  especialista_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __str__(self):
    return 'orina'
 
class ExamenSangre(db.Model):
  id = db.Column(db.Integer, primary_key= True)
  nombre = db.Column(db.String(75), default='sangre')
  status = db.Column(db.String(50), nullable=False, default='no-completado')
  hemoglobina = db.Column(db.String(100), nullable = False, default = '-')
  hematocrito = db.Column(db.String(100), nullable = False, default = '-')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  especialista_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __str__(self):
    return 'sangre'

class Anamnesis(db.Model):
  id = db.Column(db.Integer, primary_key= True)
  peso = db.Column(db.Integer, nullable = False)
  altura = db.Column(db.Integer, nullable = False)
  consulta = db.Column(db.Text, nullable = False)
  paciente_id = db.Column(db.Integer,db.ForeignKey("paciente.id") )
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)


class Diagnostico(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  informacion = db.Column(db.Text, nullable = False, default = 'pendiente')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

class Medicacion(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  informacion = db.Column(db.Text, nullable=False, default='pendiente')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow )

class Factura(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  informacion = db.Column(db.Text, nullable=False, default='pendiente')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow )

class Medicamento(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  nombre = db.Column(db.String(100), nullable = False, unique = True)
  precio = db.Column(db.Float, nullable = False)
  cantidad_disponible = db.Column(db.Integer, nullable = False)
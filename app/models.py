from .extensions import db
from datetime import datetime

# helper table para la relacion de many to many entre pacientes y especialistas
consultas = db.Table(
  'consultas',
  db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), ),
  db.Column('paciente_id', db.Integer, db.ForeignKey('paciente.id'))
)

# nuestra tabla de usuarios en la db
class Usuario(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  es_admin = db.Column(db.Boolean, nullable = False, default = False)
  nombre = db.Column(db.String(100), nullable = False, unique = True)
  correo = db.Column(db.String(50), default = 'do not fill this out')
  contrasena = db.Column(db.String(200), default = 'do not fill this out')
  horario_laboral = db.Column(db.String(50), nullable = False)
  especialidad = db.Column(db.String(50), nullable = False)# Ortopedia, ginecologia
  puesto = db.Column(db.String(30), nullable = False)#especialista, enfermero#secretaria,Farmacéutico
  pacientes = db.relationship('Paciente', secondary = consultas, back_populates = 'especialistas')
  examen_orina = db.relationship("ExamenOrina", backref='especialista')
  examen_sangre = db.relationship("ExamenSangre", backref='especialista')
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __repr__(self):
    return self.nombre

# nuestra tabla paciente en db
class Paciente(db.Model):
  id = db.Column(db.Integer, primary_key =True)
  nombre = db.Column(db.String(100), nullable = False, unique =True)
  telefono = db.Column(db.String(12), nullable = False, default = 'ninguno')
  genero = db.Column(db.String(20), nullable = False)
  dpi = db.Column(db.String(20), nullable = False, default = 'ninguno')
  direccion = db.Column(db.String(100), nullable = False)
  proceso = db.Column(db.String(50), nullable = False, default= 'en-sala')
  atendido = db.Column(db.Boolean, default=False)
  especialistas = db.relationship('Usuario', secondary = consultas, back_populates = 'pacientes')
  anamnesis = db.relationship("Anamnesis", backref = 'paciente')
  examen_orina = db.relationship("ExamenOrina", backref='paciente')
  examen_sangre = db.relationship("ExamenSangre", backref='paciente')
  diagnostico = db.relationship('Diagnostico', backref='paciente' )
  medicacion = db.relationship('Medicacion', backref= 'paciente')
  factura = db.relationship('Facturas', backref= 'paciente')
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)
  
  def __repr__(self):
    return self.nombre


class ExamenOrina(db.Model):
  id = db.Column(db.Integer, primary_key= True)
  nombre = db.Column(db.String(75),default='orina')
  status = db.Column(db.String(50), nullable=False, default='no-completado')
  aspecto = db.Column(db.String(100), nullable=False, default='orina')
  proteinas =  db.Column(db.String(100), nullable=False, default='orina')
  glucosa =  db.Column(db.String(100), nullable=False, default='orina')
  color = db.Column(db.String(100), nullable = False, default = 'orina')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  especialista_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __str__(self):
    return 'orina'
 
class ExamenSangre(db.Model):
  id = db.Column(db.Integer, primary_key= True)
  nombre = db.Column(db.String(75), default='sangre')
  status = db.Column(db.String(50), nullable=False, default='no-completado')
  hemoglobina = db.Column(db.String(100), nullable = False, default = 'sangre')
  hematocrito = db.Column(db.String(100), nullable = False, default = 'sangre')
  trigliceridos = db.Column(db.String(100), nullable = False, default = 'sangre')
  glucosa =  db.Column(db.String(100), nullable=False, default='orina')
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
  antecedentes = db.Column(db.String(100), nullable = False)
  alergias = db.Column(db.Boolean, default=False)
  paciente_id = db.Column(db.Integer,db.ForeignKey("paciente.id") )
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __str__(self):
    return self.consulta



class Diagnostico(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  informacion = db.Column(db.Text, nullable = False, default = 'pendiente')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)

  def __str__(self):
    return self.informacion



class Medicacion(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  informacion = db.Column(db.Text, nullable=False, default='pendiente')
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow )

  def __str__(self):
    return self.informacion

class Facturas(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  subtotal = db.Column(db.Text, nullable=False, default='pendiente')
  total = db.Column(db.Integer, nullable =False, default = 0)
  paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'))
  fecha_de_creacion = db.Column(db.DateTime, nullable=False, default = datetime.utcnow )

  def __str__(self):
    return self.total

class Medicamento(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  nombre = db.Column(db.String(100), nullable = False, unique = True)
  precio = db.Column(db.Float, nullable = False)
  cantidad_disponible = db.Column(db.Integer, nullable = False)

  def __str__(self):
    return self.nombre
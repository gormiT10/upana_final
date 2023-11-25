
# imports
from flask_restx import Resource,Namespace,abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (full_modelo_paciente,input_anamnesis_y_examenes, 
                          modelo_anamnesis_y_examenes, input_diagnostico_y_receta, modelo_diagnostico_receta, modelo_pacientes_en_espera_examenes_completados, modelo_resultados_examenes,modelo_especialista)
from .extensions import db, bcrypt
from .models import  Usuario, Paciente,ExamenSangre, ExamenOrina, Anamnesis,Diagnostico,Medicacion




# la autorizacion enviada en los headeres de la http request (jswonwebToken)
autorizacion = {
  "jsonWebtoken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorization"
  }
}

# blueprint
soyespecialista = Namespace('api', authorizations=autorizacion)

# ruta que nos permitira visualizar los pacientes asignados a un  especialista en especifico
@soyespecialista.route('/soyespecialista')
class PaginaParaEspecialistas(Resource):

    #decorator que nos permitira proteger nuestros endpoints
  method_decorators = [jwt_required()]

  @soyespecialista.marshal_list_with(modelo_pacientes_en_espera_examenes_completados)
  @soyespecialista.doc(security='jsonWebtoken')
  def get(self):
    try:
      pacientes_con_resultados_parciales = set()
      pacientes_con_examenes_pendientes = set()

      # identidad extraida de la session de jsonwebtokens
      identidad = get_jwt_identity()

     # verificando la identidad del especialista
      algun_especialista = db.session.query(Usuario).filter_by(id=identidad).first()
     
      if algun_especialista.puesto != 'especialista' and not algun_paciente.es_admin:
        abort(400)
      
      # seleccionando los pacientes que estan en sala de espera y esperan para pasar a consulta de este especialista
      pacientes_en_espera = (db.session.query(Paciente)
                            .filter(
                              Paciente.proceso == 'en-sala',
                            ).all()
                            )
      
      pacientes_en_espera_de_este_especialista =[paciente for paciente in pacientes_en_espera if paciente.especialistas[-1] == algun_especialista]
      

     
   
      
      # seleccionando los pacients que ya completaron examenes medicos y estan listos para que el especialista de el diagnostico
      examenes_con_resultados = ExamenSangre.query.filter_by(status='completados', especialista_id = algun_especialista.id).all() + ExamenOrina.query.filter_by(status='completados', especialista_id=algun_especialista.id).all()

      # seleccionando los pacients que no han completado examenes medicos y estan en laboratorio
      examenes_en_laboratorio = (db.session.query(ExamenSangre).filter(ExamenSangre.status == 'en-laboratorio').all() +
                        db.session.query(ExamenOrina).filter(ExamenOrina.status =='en-laboratorio').all())


      # filtrando los pacientes que fueron asignados a este especialista en especifico
      for examen in examenes_con_resultados:
        algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
        if algun_paciente:
          pacientes_con_resultados_parciales.add(algun_paciente)

    
      for examen in examenes_en_laboratorio:
        algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
        pacientes_con_examenes_pendientes.add(algun_paciente)

      # filtrando aquellos pacientes que ya completaron todos los examens de los que tienen unos pendientes
      pacientes_con_resultados_completos = list(pacientes_con_resultados_parciales-pacientes_con_examenes_pendientes)
      
      # desaciendonos de los pacientes que ya recibieron un diagnostico y receta
      lista_de_pacientes_con_resultados = [paciente for paciente in pacientes_con_resultados_completos if paciente.proceso != 'pagar-en-farmacia']
    
     
      # ordenando los pacientes en cola
      cola_de_pacientes_en_sala = sorted(pacientes_en_espera_de_este_especialista, key=lambda x:x.fecha_de_creacion)
      cola_de_examenes_completados = sorted(lista_de_pacientes_con_resultados, key=lambda x:x.fecha_de_creacion)
      lista_final =list(set(cola_de_pacientes_en_sala) | set(cola_de_examenes_completados))

      return lista_final
    
    except Exception as e:
      db.session.rollback()
      abort(500, message=f"error: {str(e)}")
  



# ruta que nos permitira llevar acabo la consulta con el paciente
@soyespecialista.route("/especialista/paciente/<int:paciente_id>")
class PaginaConsulta(Resource):
  #decorator que nos permitira proteger nuestros endpoints
  method_decorators = [jwt_required()]
  @soyespecialista.marshal_with(full_modelo_paciente)
  # metodo que devolvera la informacion basica del paciente
  @soyespecialista.doc(security='jsonWebtoken')
  def get(self, paciente_id):
    try:
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      # agregando el paciente a las lista de atendidos para que yo no apereca en sala
      algun_paciente.atendido = True
      db.session.commit()
      return algun_paciente
    except Exception as e:
       db.session.rollback()
       abort(500, message=f"error: {str(e)}")
  

  


  # este metodo nos permitira mandar la anamnesis del paciente y agregarle examenes a realizar si es necesario
  @soyespecialista.marshal_with(modelo_anamnesis_y_examenes)
  @soyespecialista.expect(input_anamnesis_y_examenes)
  @soyespecialista.doc(security='jsonWebtoken')
  def post(self,paciente_id):
    try:
    #validando la identidad del especialista
      identidad = get_jwt_identity()
      algun_especialista = Usuario.query.filter_by(id=identidad).first()

      #examenes que tenemos disponibles
      examenes_disponibles = {
        'orina': ExamenOrina,
        'sangre': ExamenSangre
      }

      # el paciente en consulta
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()


      if ('peso' not in soyespecialista.payload or 'altura' not in soyespecialista.payload or 'antecedentes' not in soyespecialista.payload or 'consulta' not in soyespecialista.payload 
          or 'alergias' not in soyespecialista.payload):
        abort(500, message='informacion insuficiente')

      # guardando la anamnesis en nuestra base de datos
      nueva_consulta = Anamnesis(peso =soyespecialista.payload['peso'], altura = soyespecialista.payload['altura'],antecedentes = soyespecialista.payload['antecedentes'],
                                consulta= soyespecialista.payload['consulta'], paciente_id = algun_paciente.id, alergias  = soyespecialista.payload['alergias'],)
      
      # el estado de la cita medica cambia 
      algun_paciente.proceso = 'en-consulta'
      db.session.add(nueva_consulta)
      db.session.commit()


      for examen in soyespecialista.payload['examenes']:
        if examen in examenes_disponibles:
          examen_en_laboratorio = examenes_disponibles[examen]
          nuevo_examen = examen_en_laboratorio(status = 'en-laboratorio', paciente_id=paciente_id, especialista_id = algun_especialista.id)
          db.session.add(nuevo_examen)
          db.session.commit()

      # de aqui redireccionaremos a la pagina principal y el laboratorista podra ver que tiene pacientes en fila
      return nueva_consulta 
    except Exception as e:
      db.session.rollback()
      abort(500, message=f"error: {str(e)}")
  
 

@soyespecialista.route('/especialistas/receta/<int:paciente_id>')
class RecetaMedica(Resource):

  method_decorators = [jwt_required()]

  @soyespecialista.marshal_with(modelo_resultados_examenes)
  def get(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    examenes = ExamenSangre.query.filter_by(status='completados', paciente_id = algun_paciente.id).all() + ExamenOrina.query.filter_by(status='completados', paciente_id=algun_paciente.id).all()
    return examenes


  @soyespecialista.marshal_with(modelo_diagnostico_receta)
  @soyespecialista.expect(input_diagnostico_y_receta)
  @soyespecialista.doc(security='jsonWebtoken')
  def post(self,paciente_id):
    try:  
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      algun_paciente.proceso = 'pagar-en-farmacia'
      db.session.commit()
      nuevo_diagnostico = Diagnostico(informacion = soyespecialista.payload['diagnostico'], paciente_id = paciente_id)
    
      db.session.add(nuevo_diagnostico)
      db.session.commit()

      medicamento = zip(soyespecialista.payload['cantidad'],soyespecialista.payload['medicamento'], soyespecialista.payload['dosis'])
      receta = '\n'.join(' '.join(map(str, i)) for i in medicamento)
      nueva_medicacion = Medicacion(informacion=receta, paciente_id=paciente_id)
      db.session.add(nueva_medicacion)
      db.session.commit()

      # redireccionar al menu principal para que puedan ir a pagar a farmacia
      return algun_paciente
    except Exception as e:
      db.session.rollback()
      abort(500, message=f"error: {str(e)}")


      # ruta paraw obtener los especialistas
@soyespecialista.route("/nuestros/especialistas")
class ListaEspecialistas(Resource):
  method_decorators = [jwt_required()]

  @soyespecialista.marshal_list_with(modelo_especialista)
  @soyespecialista.doc(security='jsonWebtoken')
  def get(self):
    try:
      especialistas = Usuario.query.filter_by(puesto = 'especialista').all()
      for especialista in especialistas:
        print(especialista)
      return especialistas
    except Exception as e:
      abort(500, message=f'error {e}')





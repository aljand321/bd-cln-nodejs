import MedicoUser from '../controllers/MedicoUser';
import Login from '../controllers/Login';
import Paciente from "../controllers/Paciente";
import Consultas from '../controllers/Consultas';
import Alergias from "../controllers/Alergias";
import Transfuciones from "../controllers/Transfuciones";
import Cirugias from "../controllers/Cirugias";
import OtrEnfermedades from "../controllers/OtrEnfermedades";
import AntcPersonNoPatologicos from "../controllers/AntcPersNoPatologicos";
import AntecedentesFamiliares from "../controllers/AnteceFamiliares";
import ExamenFisico from "../controllers/exmFisico";
import AntGinecoObst from "../controllers/AntcGinecoObst";
import Vacunas from "../controllers/Vacunas";
import AntPediatricos from '../controllers/AntPedriaticos';
export default (app) => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the BookStore API!",
    })
  );

  //medico user
  app.post('/api/createMedico/:id_medicoUser', MedicoUser.create);
  app.get('/api/getList', MedicoUser.getList); // esto no depende del login
  app.get('/api/medico', MedicoUser.list);
  app.get('/api/medico/:id_medico', MedicoUser.oneUser);
  app.put('/api/medico/:id_medico', MedicoUser.updateUser);
  app.delete('/api/deleteMEdico/:id_user', MedicoUser.deleteUser);
  app.post('/api/listPasientemedico/:id_medico',MedicoUser.lisPacientesMEdico);
  app.get('/api/listaUsers', MedicoUser.listaUsers)

  //para el panel
  app.get('/api/totalMEdicos', MedicoUser.medicos);
  app.get('/api/totalUsarios', MedicoUser.usarios);
  app.get('/api/pacientesR', MedicoUser.pacientesR);
  app.post('/api/vacunadosCovid', MedicoUser.vacunadosCovid);
  app.get('/api/porcentajeVacunadosC19', MedicoUser.porcentajeVacunadosC19);

  //login
  app.post('/api/login', Login.login);
  app.post('/api/createfirstUser',Login.createFirstUser);
  app.get('/api/verifyToken', Login.verifyToken);
  

  //paciente
  app.post('/api/paciente/:id_medico',Paciente.create); 
  app.post('/api/buscarPaciente', Paciente.buscarPaciente);
  app.post('/api/pagination/', Paciente.pagination);
  app.get('/api/onePaciente/:id_paciente', Paciente.onePaciente);
  //responsable
  app.post('/api/responsable/:id_medico', Paciente.responsable);
  app.get('/api/responsable/:id_paciente', Paciente.listRespPaciente);

  //consulta paciente
  app.post('/api/consulta/:id_paciente/:id_medico', Consultas.create);
  app.get('/api/consulta/:id_paciente/:id_medico', Consultas.consultaPaciente);
  app.get('/api/oneConsulta/:id_consulta', Consultas.oneConsulta);
  app.get('/api/consultasMedico/:id_medico', Consultas.consultaMEdico);
  //Retorno
  app.post('/api/retorno/:id_medico/:id_consulta', Consultas.createRetorno);
  app.get('/api/retorno/:id_consulta', Consultas.listRetornConsulta);

  //alergias
  app.post('/api/alergias/:id_medico', Alergias.create);
  app.post('/api/pacienteAlergias/:id_medico', Alergias.createAlgPaciente);
  app.get('/api/pacienteAlergias/:id_paciente/:id_medico', Alergias.listALgPaciente);
  app.post('/api/buscarAlergia', Alergias.buscarAlergia);
  app.get('/api/OneAlergia/:id_alergia',Alergias.oneAlergia);
  app.put('/api/updateAlergia/:id_alergia',Alergias.updateAlergia);

  // transfuciones
  app.post('/api/transfcion/:id_medico',Transfuciones.create);
  app.post('/api/pacienteTransfuciones/:id_medico', Transfuciones.createTransfucionPaciente);
  app.get('/api/pacienteTransfuciones/:id_paciente/:id_medico', Transfuciones.listTransfucionesPaciente);
  app.post('/api/buscarTransfucion', Transfuciones.buscarTransfucion);
  app.get('/api/oneTransfucion/:id_transfucion', Transfuciones.oneTransfucion);
  app.put('/api/updateTransfucion/:id_transfucion',Transfuciones.updateTransfucion);
  //cirugias previas
  app.post('/api/cirugias/:id_medico',Cirugias.create);
  app.post('/api/pacienteCirugias/:id_medico', Cirugias.createCirugiasPaciente);
  app.get('/api/pacienteCirugias/:id_paciente/:id_medico', Cirugias.listCirugiasPaciente);
  app.post('/api/buscarCirugia', Cirugias.buscarCirugia);
  app.get('/api/oneCirugia/:id_cirugia', Cirugias.oneCirugia);
  app.put('/api/updateCirugia/:id_cirugia',Cirugias.updateCirugia);
  //otras enfermedades
  app.post('/api/otrEnfermedades/:id_medico',OtrEnfermedades.create);
  app.post('/api/pacienteEnfermedades/:id_medico', OtrEnfermedades.createOtrEnfPaciente);
  app.get('/api/pacienteEnfermedades/:id_paciente/:id_medico', OtrEnfermedades.listEnfPaciente);
  app.post('/api/buscarEnfermedad', OtrEnfermedades.buscarEnf);
  app.get('/api/oneOtraEnfermdad/:id_otrasEnf', OtrEnfermedades.oneOtrEnf);
  app.put('/api/updateOtraEnfermedad/:id_otrasEnf',OtrEnfermedades.updateOtrEnf);
  //antecedentes no patologicos
  app.post('/api/antecedentesNoPtl/:id_medico/:id_paciente', AntcPersonNoPatologicos.create);
  app.get('/api/antNoPtlPaciente/:id_paciente/:id_medico', AntcPersonNoPatologicos.list);
  app.get('/api/oneAntNoPtl/:id_antecedente', AntcPersonNoPatologicos.oneAntecedentes);

  //antecedentes familiares
  app.post('/api/createAntFamiliares/:id_medico/:id_paciente',AntecedentesFamiliares.create);
  app.get('/api/listAntFamiliares/:id_paciente/:id_medico',AntecedentesFamiliares.list)

  //Examen fisico
  app.post('/api/createExamenFisico/:id_medico/:id_paciente',ExamenFisico.create);
  app.get('/api/listExFisPaciente/:id_paciente/:id_medico', ExamenFisico.listExFis);
  app.get('/api/oneExamenFisico/:id_examenFisico', ExamenFisico.oneExFis);

  //antecedentes gineco obstetricos
  app.post('/api/createAntGincoObs/:id_medico/:id_paciente',AntGinecoObst.create);
  app.get('/api/listAntGnbPaciente/:id_paciente/:id_medico',AntGinecoObst.list);

  //vacunas
  app.post('/api/createVacuna/:id_medico',Vacunas.create);
  app.post('/api/vacunaPaciente/:id_medico', Vacunas.createVacunaPaciente);
  app.get('/api/vacunaPaciente/:id_paciente/:id_medico', Vacunas.listVacunasPaciente);
  app.post('/api/buscarVacuna', Vacunas.buscador);

  //antecedentes pediatricos
  app.post('/api/createAntPedriaticos/:id_medico/:id_paciente', AntPediatricos.create);
  app.get('/api/antPediatricos/:id_paciente/:id_medico',AntPediatricos.lisAntPediatricos)

};

//sequelize model:create --name peronal --attributes nombre:string,apellidos:string,ci:string,telefono:integer,direccion:string,edad:date,img:string,profecion:string,especialidad:string,fechaDeContrato:string
//sequelize model:create --name medicoUser --attributes nombres:string,apellidos:string,ci:string,email:string,direccion:string,password:string
//sequelize model:create --name paciente --attributes nombres:string,apellidos:string,sexo:boolean,direccion:string,edad:date,ocupacion:string,id_medico:integer
//sequelize model:create --name antcPersonalesNoPtl --attributes instruccion:string,fuma:string,bebe:string,alimentacion:string,id_paciente:integer
//sequelize model:create --name antcPersonalesPtl --attributes alergias:string,transfuciones:string,cirugiasPre:string,otrasEnf:string,id_paciente:integer
//sequelize model:create --name antcFamiliares --attributes padre:json,madre:json,hnos:json,estSalud:string,id_paciente:integer
//sequelize model:create --name inmunizaciones --attributes fecha:date,tipo:json,otros:string,id_paciente:integer
//sequelize model:create --name antcGinecoObst --attributes fecha:date,menarca:number,ritmo:string,fmu:string,gestaCesaria:string,abortos:string,nacidoVivos:integer,mortinatos:integer,plfcFamiliar:string,id_paciente:integer
//sequelize model:create --name consulta --attributes motivo:text,enfermedadActual:text,signosVitales:json,examenFisoco:json,id_paciente:integer,id_medico:integer
//
//sequelize model:create --name alergias --attributes nombre:string,descripcion:string,id_paciente:integer,id_medico:integer
//sequelize model:create --name transfuciones --attributes nombre:string,descripcion:string,id_paciente:integer,id_medico:integer
//sequelize model:create --name cirugiasPrevias --attributes nombre:string,descripcion:string,id_paciente:integer,id_medico:integer
//sequelize model:create --name OtrasEnfermedades --attributes nombre:string,descripcion:string,id_paciente:integer,id_medico:integer

//sequelize model:create --name algPaciente --attributes id_paciente:integer,id_alergia:integer,id_medico:integer
//sequelize model:create --name trPaciente --attributes id_paciente:integer,id_transfucion:integer,id_medico:integer
//sequelize model:create --name crPaciente --attributes id_paciente:integer,id_cirugiaP:integer,id_medico:integer
//sequelize model:create --name otrasEnfPaciente --attributes id_paciente:integer,id_otrasEnf:integer,id_medico:integer

//responsables del paciente

//sequelize model:create --name responsable --attributes nombres:string,apellidos:string,ci:string,telefono:string,direccion:string,id_paciente:integer,id_medico:integer
//sequelize model:create --name responsablePaciente --attributes descripcion:text,id_responsable:integer,id_paciente:integer,id_medico:integer
//sequelize model:create --name retornoPaciente --attributes subjetivo:text,objetivo:text,diagnostico:text,tratamiento:text,id_medico:integer,id_consulta:integer

//sequelize model:create --name examenFisico --attributes cabeza:text,cuello:text,torax:text,pulmones:text,corazon:text,abdomen:text,ginecoUrinario:text,locomotor:text,neurologico:text,pielyFaneras:text

//sequelize model:create --name vacunas --attributes nombre:string,descripcion:text,id_medico:integer

//sequelize model:create --name vacunasPaciente --attributes fecha:date,id_paciente:integer,id_vacuna:integer,id_medico:integer

//antecedentes pedriatricos
//sequelize model:create --name antPediatricos --attributes pesoRn:string,tipodeParto:string,obsPerinatales:string,id_paciente:integer,id_medico:integer



//
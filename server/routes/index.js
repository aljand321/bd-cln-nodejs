import Users from "../controllers/user";
import Books from "../controllers/book";

import MedicoUser from '../controllers/MedicoUser';
import Login from '../controllers/Login';
import Paciente from "../controllers/Paciente";
import Consultas from '../controllers/Consultas';
import Alergias from "../controllers/Alergias";
import Transfuciones from "../controllers/Transfuciones";
import Cirugias from "../controllers/Cirugias";
import OtrEnfermedades from "../controllers/OtrEnfermedades";
export default (app) => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the BookStore API!",
    })
  );

  app.post("/api/users", Users.signUp); // API route for user to signup
  app.post("/api/users/:userId/books", Books.create); // API route for user to create a book
  app.get("/api/books", Books.list); // API route for user to get all books in the database
  app.put("/api/books/:bookId", Books.modify); // API route for user to edit a book
  app.delete("/api/books/:bookId", Books.delete); // API route for user to delete a book

  //medico user
  app.post('/api/medico', MedicoUser.create);
  app.post('/api/createMedico', MedicoUser.create);
  app.get('/api/getList', MedicoUser.getList);
  app.get('/api/medico', MedicoUser.list);
  app.get('/api/medico/:id_medico', MedicoUser.oneUser);
  app.put('/api/medico/:id_medico', MedicoUser.updateUser);
  app.delete('/api/deleteMEdico/:id_user', MedicoUser.deleteUser)

  app.post('/api/login', Login.login);
  app.get('/api/verifyToken', Login.verifyToken);

  //paciente
  app.post('/api/paciente/:id_medico',Paciente.create);
  app.get('/api/pacientes',Paciente.list);
  app.post('/api/buscarPaciente', Paciente.buscarPaciente);
  app.post('/api/pagination/', Paciente.pagination);
  app.get('/api/onePaciente/:id_paciente', Paciente.onePaciente)

  //consulta paciente
  app.post('/api/consulta/:id_paciente/:id_medico', Consultas.create);
  app.get('/api/consutla/:id_paciente', Consultas.consultaPaciente);

  //alergias
  app.post('/api/alergias/:id_medico', Alergias.create);
  app.post('/api/pacienteAlergias/:id_medico', Alergias.createAlgPaciente);
  app.get('/api/pacienteAlergias/:id_paciente', Alergias.listALgPaciente);
  app.post('/api/buscarAlergia', Alergias.buscarAlergia);

  // transfuciones
  app.post('/api/transfcion/:id_medico',Transfuciones.create);
  app.post('/api/pacienteTransfuciones/:id_medico', Transfuciones.createTransfucionPaciente);
  app.get('/api/pacienteTransfuciones/:id_paciente', Transfuciones.listTransfucionesPaciente);
  app.post('/api/buscarTransfucion', Transfuciones.buscarTransfucion);

  //cirugias previas
  app.post('/api/cirugias/:id_medico',Cirugias.create);
  app.post('/api/pacienteCirugias/:id_medico', Cirugias.createCirugiasPaciente);
  app.get('/api/pacienteCirugias/:id_paciente', Cirugias.listCirugiasPaciente);
  app.post('/api/buscarCirugia', Cirugias.buscarCirugia);

  //otras enfermedades
  app.post('/api/otrEnfermedades/:id_medico',OtrEnfermedades.create);
  app.post('/api/pacienteEnfermedades/:id_medico', OtrEnfermedades.createOtrEnfPaciente);
  app.get('/api/pacienteEnfermedades/:id_paciente', OtrEnfermedades.listEnfPaciente);
  app.post('/api/buscarEnfermedad', OtrEnfermedades.buscarEnf);

};


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



//
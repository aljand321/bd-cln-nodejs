import Users from "../controllers/user";
import Books from "../controllers/book";

import MedicoUser from '../controllers/MedicoUser';
import Login from '../controllers/Login';

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
//


//
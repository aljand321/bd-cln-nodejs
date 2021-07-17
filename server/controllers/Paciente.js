import model from '../models';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//const { medicoUser } = model;
const { paciente } = model;

class Paciente {
    static async create(req,res){
        const { nombres,apellidos,sexo,ci,telefono,direccion,edad,ocupacion } = req.body;
        console.log(req.body);
        console.log(req.params);
        const { id_medico } = req.params;
        const verifyDatas = await validateDatas(nombres,apellidos,sexo,direccion,edad,ocupacion,id_medico,ci,telefono);
        if(verifyDatas.success == false) return res.status(200).json(verifyDatas)
        try {
            const resp = await paciente.create({
                nombres,
                apellidos,
                sexo,
                ci,
                telefono,
                direccion,
                edad,
                ocupacion,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:"Se creo el paciente",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
    static async list(req,res){
        try {
            const resp = await paciente.findAll({
                attributes:['id','nombres','apellidos','sexo','ci','telefono','direccion','edad','ocupacion']
            });
            res.status(200).json({
                success:true,
                msg:"lista de pacientes",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async buscarPaciente(req,res){
        const { buscar,pagina,limite } = req.body;
        const getPagination = (page, size) => {
            const limit = size ? +size : 2;
            const offset = page ? page * limit : 0;
          
            return { limit, offset };
        };
        const getPagingData = (data, page, limit) => {
            const { count: totalItems, rows: datas } = data;
            const currentPage = page ? +page : 0;
            const totalPages = Math.ceil(totalItems / limit);
            
            return { 
                success:true,
                msg:"paginacion",
                totalItems,
                totalPages, 
                currentPage, 
                reps:datas 
            };
        };
        const { limit, offset } = getPagination(pagina, limite);
        try {
            const resp = await paciente.findAndCountAll({
                limit,
                offset,
                where:{                    
                    [Op.or]: [
                        {nombres:{ [Op.iLike]: `${buscar}%`}},
                        {apellidos:{ [Op.iLike]: `${buscar}%`}},
                        {sexo:{ [Op.iLike]: `${buscar}%`}},
                        {ci:{ [Op.iLike]: `${buscar}%`}},
                        {telefono:{ [Op.iLike]: `${buscar}%`}},
                        {direccion:{ [Op.iLike]: `${buscar}%`}},
                        {ocupacion:{ [Op.iLike]: `${buscar}%`}},
                    ]                    
                },
                attributes:['id','nombres','apellidos','sexo','ci','telefono','direccion','edad','ocupacion']
            })
            const response = getPagingData(resp, pagina, limit); 
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async pagination(req,res){
        const { limite, pagina } = req.body;
        const getPagination = (page, size) => {
            const limit = size ? +size : 2;
            const offset = page ? page * limit : 0;
          
            return { limit, offset };
        };
        const getPagingData = (data, page, limit) => {
            const { count: totalItems, rows: datas } = data;
            const currentPage = page ? +page : 0;
            const totalPages = Math.ceil(totalItems / limit);
            
            return { totalItems,totalPages, currentPage, datas };
        };

        const { limit, offset } = getPagination(pagina, limite);
        try {
            const resp = await paciente.findAndCountAll({
                limit,
                offset
            });
            const response = getPagingData(resp, pagina, limit); 
            res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }

    }
    static async onePaciente(req,res){
        const { id_paciente } = req.params;
        try {
            const resp = await paciente.findOne({
                where:{id:id_paciente},
                attributes:['id','nombres','apellidos','sexo','ci','telefono','direccion','edad','ocupacion','id_medico']
            });
            let hoy = new Date();
            let fechaNacimiento = new Date(resp.edad)
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            if(resp)return res.status(200).json({
                success:true,
                msg:"paciente",
                resp:{
                    id:resp.id,
                    nombres:resp.nombres,
                    apellidos:resp.apellidos,
                    sexo:resp.sexo,
                    ci:resp.ci,
                    telefono:resp.telefono,
                    direccion:resp.direccion,
                    edad:edad,
                    ocupacion:resp.ocupacion,
                    id_medico:resp.id_medico,
                }
            })
            return res.status(200).json({
                success:false,
                msg:"El paciente no exite"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
}
async function validateDatas(nombres,apellidos,sexo,direccion,edad,ocupacion,id_medico,ci,telefono){
    if(!nombres)return {success:false,msg:"Nombre del paciente es obligatorio",name:"nombres"};
    if(!apellidos)return {success:false,msg:"Apellido del paciente es obligatorio",name:"apellidos"};
    if(!sexo)return {success:false,msg:"Sexo del paciente es obligatorio",name:"sexo"};
    if(!direccion)return {success:false,msg:"Direccion del paciente es obligatorio",name:"direccion"};
    if(!edad)return {success:false,msg:"Edad del paciente es obligatorio",name:"edad"};
    if(!ocupacion)return {success:false,msg:"Ocupacion del paciente es obligatorio",name:"ocupacion"};
    if(!id_medico)return {success:false,msg:"El id del medico no se esta mandando", name:'id'};
    const verifyCiTelf = await validateCiTelfono(ci,telefono);
    if(verifyCiTelf.success == false)return verifyCiTelf
    return {success:true,msg:"puedes continuar"}
}

async function validateCiTelfono(ci,telefono){
    if(ci || telefono){
        try {
            const resp = await paciente.findOne({
                where:{
                    [Op.or]: [{ci},{telefono}]
                }
            });
            if(resp){
                if(resp['ci'] == ci)return {success:false,msg:"C.I. ya esta registrado",name:"ci"}
                if(resp['telefono'] == telefono)return {success:false,msg:"Telefono ya esta registrado",name:"telefono"}
            }
            return {success:true,msg:"Puedes continuar"}
        } catch (error) {
            console.log(error, 'kjhkjhkjhkjhkjhkhkjhkjh')
            return {success:false,msg:"error 500",error}
        }
    }else{
        return {success:true,msg:"Puedes continuar"}
    }
}
export default Paciente;
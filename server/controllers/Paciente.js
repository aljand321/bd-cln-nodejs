import { json } from 'sequelize';
import model from '../models';

const Sequelize = require('sequelize');
var sq = require('../models/index');
const Op = Sequelize.Op;

//const { medicoUser } = model;
const { paciente,responsablePaciente,medicoUser } = model;

class Paciente {
    static async create(req,res){
        const { nombres,apellidos,sexo,ci,telefono,direccion,edad,ocupacion } = req.body;
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
    static async buscarPaciente(req,res){
        
        const { buscar,pagina,limite } = req.body
        console.log( req.body);
        
        const resp = await getUsers(buscar);
        if(resp.success == false)return res.status(200).json(resp);

        var pageNumber=(pagina * 1) || 0; 
        var pageSize=(limite * 1) || 8; 
        var pacientes = resp.resp
        var pageCont =Math.ceil(pacientes.length/pageSize);   
        console.log(pageNumber * pageSize, (pageNumber + 1 ) * pageSize)        
        let pag = pacientes.slice(pageNumber * pageSize, (pageNumber + 1 ) * pageSize);
        res.status(200).json({
            success:true,
            msg:"Pacientes encontrados",
            totalItems:resp.resp.length,
            totalPages:pageCont,
            currentPage:(pagina * 1) ,
            reps:pag
        })
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
                attributes:['id','nombres','apellidos','sexo','ci','telefono','direccion','edad','ocupacion','id_medico','createdAt']
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
                    createdAt:resp.createdAt
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
    static async responsable(req,res){
        const {descripcion, id_paciente,id_responsable} = req.body;
        const {id_medico} = req.params;        
        const verifyMedico = await validateMEdico(id_medico);
        if(verifyMedico.success == false) return res.status(200).json(verifyMedico);
        const verifyPaciente = await validatePaciente(id_paciente);
        if (verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        const verifyResponsable = await validatePaciente(id_responsable);
        if(verifyResponsable.success == false) return res.status(200).json(verifyResponsable)
        
        if (!descripcion) return res.status(200).json({
            success:false,
            msg:"Descripcion es obligatorio para el responsable",
            name:"descripcion"
        });
        if (id_paciente == id_responsable) return res.status(200).json({
            success:false,
            msg:"El paciente no puede ser responsable de si mismo",
            name:'id_paciente'
        })
        const veriFyREsp = await validateResponsable(id_paciente,id_responsable);
        if(veriFyREsp.success == false) return res.status(200).json(veriFyREsp)
        console.log(req.body)
        try {
            const resp = await responsablePaciente.create({
                descripcion,
                id_responsable,
                id_paciente,                
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Se creo el responsable",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
        
    }
    static async listRespPaciente(req,res){
        const { id_paciente } = req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false)return res.status(200).json(verifyPaciente);
        try {
            const resp = await sq.sequelize.query(`
                select TR.id,TR.id_responsable, TP.nombres, TP.apellidos, TR.descripcion, TR.id_paciente
                from "responsablePacientes" TR, "pacientes" TP
                where TP.id = TR.id_responsable and TR.id_paciente = ${id_paciente}
            `);
            res.status(200).json({
                success:true,
                msg:"Lista de responsables del paciente",
                resp:resp[0]
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
    const verifyMedico = await validateMEdico(id_medico);
    if(verifyMedico.success == false)return verifyMedico

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

async function getUsers (buscador){
    console.log(buscador)
    try {
        const resp = await sq.sequelize.query(`
            select id, nombres,apellidos,sexo,ci,telefono,direccion,date_part('year',age(now(),"edad")) "edad",ocupacion
            from "pacientes"
            order by id desc
        `)
        const filterData = await resp[0].filter((data)=>{
            return data.nombres.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.apellidos.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.ci.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.telefono.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.direccion.toLowerCase().includes(buscador.toLowerCase())
        })
        return {success:true,msg:"Lista de pacientes encontrados", resp:filterData}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"error 500"}
    }
}

async function validatePaciente(id_paciente){
    try {
        const resp = await paciente.findOne({
            where:{id:id_paciente}
        })
        if(resp) return {success:true,msg:"existe el paciente", resp};
        return {success:false, msg:"No existe ese paciente"}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"error 500"}
    }
}

async function validateMEdico(id_medico){
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        if(resp) return {success:true,msg:"Existe medico", resp};
        return {success:false, msg:"No existe ese medico"}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"error 500"}
    }
}

async function validateResponsable(id_paciente,id_responsable){
    try {
        const resp = await responsablePaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_responsable}]
            }
        })
        if(resp) return {success:false, msg:"Ya se registro un parentesco entre ellos"};
        return {success:true,msg:"Puedes continuar"};
    } catch (error) {
        console.log(error);
        return {success:false,msg:"error 500"};
    }
}
export default Paciente;
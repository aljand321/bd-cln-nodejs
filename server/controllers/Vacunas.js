import model from '../models';
const Sequelize = require('sequelize');
var sq = require('../models/index');
const Op = Sequelize.Op;
const { vacunas,vacunasPaciente,medicoUser,paciente } =  model;

class Vacunas {
    static async create (req,res){// crear un vacuna
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        console.log(req.body)
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
        try {
            const resp = await vacunas.create({
                nombre:nombre.trim(),
                descripcion,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:" Se crearon los datos",
                resp
            })
        } catch (error) {
            res.status(500).json(error)

        }
    }
    static async createVacunaPaciente(req,res){ 
        const {descripcion,fecha,id_paciente, id_vacuna} = req.body
        const {id_medico}= req.params;
        console.log(req.body)
        const verifyVacuna = await validateVacuna(id_vacuna);
        if(verifyVacuna.success == false) return res.status(200).json(verifyVacuna);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyVacunaPaciente = await existVacunaPaciente(id_paciente, id_vacuna, descripcion);
        if(verifyVacunaPaciente.success == false) return res.status(200).json(verifyVacunaPaciente);
        try {
            const resp = await vacunasPaciente.create({
                description:descripcion,
                fecha,
                id_paciente, 
                id_vacuna,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro ${verifyVacuna.nombre} al paciente`,
                resp
            })
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
    static async listVacunasPaciente(req,res){
        const {id_paciente,id_medico}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await sq.sequelize.query(`
            select TP.id, TVP.id_vacuna,TVP.id_medico,TVP.description,TVP.fecha "fechaVacuanPaciente", TV.nombre "vacuna",TV.descripcion "VacunaDescripcion",TM.nombres "medico"
            from "pacientes" TP, "vacunasPacientes" TVP, "vacunas" TV, "medicoUsers" TM
            where TP.id = ${id_paciente} and TP.id = TVP.id_paciente and TVP.id_vacuna = TV.id and TVP.id_medico = TM.id
            `);
            let vacuna = await resp[0].filter((data)=>{
                //console.log(data.id_medico)
                return data.id_medico == id_medico;
            })
            res.status(200).json({
                success:true,
                msg:"Lista de vacunas del paciente",
                resp:id_medico == 'null' ? resp[0] : vacuna
            })
        } catch (error) {   
            console.log(error)         
            res.status(500).json(error)
        }
        
    }
    static async buscador(req,res){
        const {pagenumber,pagesize,buscador}= req.body
       
        const allP = await all(buscador);
        if(allP.success == false)return res.status(200).json(allP)
        var pageNumber=pagenumber || 1; 
        var pageSize=pagesize||8; 
        var vacunas = allP.resp
        var pageCont =Math.ceil(vacunas.length/pageSize);           
        let pag = vacunas.slice((pageNumber - 1 ) * pageSize, pageNumber * pageSize);
        res.status(200).json({
            success:true,
            msg:"Lista de vacunas",
            resp:{
                paginas:pageCont,
                datas:pag
            }
            
        });          
    }
}
async function validateMedico(id_medico){
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        });
        if(resp) return {success:true,msg:"si existe ese medico"}
        return {success:false,msg:"no existe ese medico"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function validateNombre(nombre){
    if(!nombre) return {success:false,msg:"Nombre es obligatorio", name:'nombre'}
    try {
        const resp = await vacunas.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        if(resp) return {success:false,msg:"Vacuna ya registrado", name:'nombre'}
        return {success:true,msg:"no existe vacuna"}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500",error:'500'}
    }
}
async function validateVacuna(id_vacuna){
    if(!id_vacuna) return {success:false,msg:"no se seleciono Vacuna"}
    try {
        const resp = await vacunas.findOne({
            where:{id:id_vacuna}
        });
        if(resp) return {success:true,msg:"Existe el vacuna",nombre:resp.nombre}
        return {success:false,msg:"No existe vacuna"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function validatePaciente(id_paciente){
    if(!id_paciente) return {success:false,msg:"id del paciente no se esta mandando"}
    try {
        const resp = await paciente.findOne({
            where:{id:id_paciente}
        });
        if(resp) return {success:true,msg:"Existe el paciente"}
        return {success:false,msg:"No existe paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function existVacunaPaciente(id_paciente, id_vacuna, description){
    const nombre = await validateVacuna(id_vacuna)
    try {
        const resp = await vacunasPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_vacuna},{description}]
            }
        })
        if(resp) return {success:false,msg:`${nombre.nombre} ${resp.description}:  Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"} 
    }
}

async function all(buscador){
    try {
        const resp = await vacunas.findAll();

        var filtrar = resp.filter((item)=>{
            return item.nombre.toLowerCase().includes(buscador.toLowerCase())||
            item.descripcion.toLowerCase().includes(buscador.toLowerCase())
        })        
        return {success:true,msg:"Lista de vacunas", resp:filtrar}
    } catch (error) {
        console.log(error, ' sssssssssssssss44444444444444445555555555555555555555555555666666666666666')
        return {success:false, msg:"erro 500"}
    }
}
export default Vacunas;

import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { alergias,medicoUser,paciente,algPaciente } = model;

class Alergias{
    static async create (req,res){// crear un alaergia
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(400).json(verifyMEdico);
        try {
            const resp = await alergias.create({
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
    static async createAlgPaciente(req,res){ // registrar alergia del paciente
        const {id_paciente, id_alergia} = req.body
        const {id_medico}= req.params;
        const verifyAlergia = await validateAlergia(id_alergia);
        if(verifyAlergia.success == false) return res.status(200).json(verifyAlergia);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyAlergiaPaciente = await existAlergiaPaciente(id_paciente, id_alergia);
        if(verifyAlergiaPaciente.success == false) return res.status(200).json(verifyAlergiaPaciente);
        try {
            const resp = await algPaciente.create({
                id_paciente, 
                id_alergia,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro ${verifyAlergia.nombre} al paciente`,
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async listALgPaciente(req,res){
        const {id_paciente}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await paciente.findAll({
                where:{id:id_paciente},
                include:[{
                    model:alergias,
                    attributes:['id','nombre','descripcion','createdAt'],
                    as:'alergias'
                    
                }],
                attributes:['id',]
            });
            res.status(200).json({
                success:true,
                msg:"Lista de alergias del paciente",
                resp
            })
        } catch (error) {            
            res.status(500).json(error)
        }
        
    }
    static async buscarAlergia(req,res){
        const {buscador}= req.body;    
        try {
            const resp = await alergias.findAll({
                limit : 8,
                offset: 0,
                where:{                    
                    [Op.or]: [
                        {nombre:{ [Op.iLike]: `${buscador}%`}},
                        {descripcion:{ [Op.iLike]: `${buscador}%`}}                        
                    ]                    
                },
                attributes:['id','nombre','descripcion','id_medico']
            });
            console.log(resp)
            let datas = []
            for(let i = 0; i < resp.length; i++){
                datas.push({
                    id:resp[i].id,
                    nombre:resp[i].nombre,
                    descripcion:resp[i].descripcion,
                    id_medico:resp[i].id_medico,
                    selected:false
                })
            }
            res.status(200).json({
                success:true,
                msg:"lista de alergias",
                resp:datas
            })
        } catch (error) {
            res.status(500).json(error)
        }
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
        const resp = await alergias.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        //console.log(resp, ' alskdjlaksjdlkajsdlkajsldkj')
        if(resp) return {success:false,msg:"Alergia ya esta registrado", name:'nombre'}
        return {success:true,msg:"no existe alergia"}
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
async function validateAlergia(id_alergia){
    if(!id_alergia) return {success:false,msg:"no se seleciono alergia"}
    try {
        const resp = await alergias.findOne({
            where:{id:id_alergia}
        });
        if(resp) return {success:true,msg:"Existe el alergia",nombre:resp.nombre}
        return {success:false,msg:"No existe alergia"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function existAlergiaPaciente(id_paciente, id_alergia){
    const nombre = await validateAlergia(id_alergia)
    try {
        const resp = await algPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_alergia}]
            }
        })
        if(resp) return {success:false,msg:`${nombre.nombre}: Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"} 
    }
}
export default Alergias;
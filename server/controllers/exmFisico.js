import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { examenFisico,paciente,medicoUser } = model;

class ExamenFisico{
    static async create (req,res){
        const { cabeza,cuello,torax,pulmones,corazon,abdomen,ginecoUrinario,locomotor,neurologico,pielyFaneras } = req.body;
        const { id_paciente,id_medico } = req.params;         
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);  
        const verifyData = await validateData(req.body);
        if(verifyData.success == false) return res.status(200).json(verifyData);          
        try {
            const resp = await examenFisico.create({
                cabeza,
                cuello,
                torax,
                pulmones,
                corazon,
                abdomen,
                ginecoUrinario,
                locomotor,
                neurologico,
                pielyFaneras,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Se crearon los datos",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
    static async listExFis (req,res){
        const {id_paciente}= req.params;
        console.log(req.params)
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);  
        try {
            const resp = await examenFisico.findAll({
                where:{id_paciente},
                attributes:[
                    'id',
                    'cabeza',
                    'cuello',
                    'torax',
                    'pulmones',
                    'corazon',
                    'abdomen',
                    'ginecoUrinario',
                    'locomotor',
                    'neurologico',
                    'pielyFaneras',
                    'createdAt',                    
                    'id_medico'
                ]
            });
            res.status(200).json({
                success:true,
                msg:"lista de examenes del paciente",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
    static async oneExFis (req,res){
        const {id_examenFisico}= req.params;
        try {
            const resp = await examenFisico.findOne({
                where:{id:id_examenFisico},
                attributes:['id','cabeza','cuello','torax','pulmones','corazon','abdomen','ginecoUrinario','locomotor','neurologico','pielyFaneras','createdAt']
            });
            if(resp){
                res.status(200).json({
                    success:true,
                    msg:"lista de examenes del paciente",
                    resp
                })
            }else{
                res.status(200).json({
                    success:false,
                    msg:"No hay nada que mostrar"
                })
            }
            
        } catch (error) {
            res.status(500).json(error)
        }
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
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
async function validateMedico(id_medico){
    if(!id_medico)  return {success:false,msg:"id del meeico no se esta mandando"}
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        });
        if(resp) return {success:true,msg:"Existe ese medico"}
        return {success:false,msg:"no existe ese medico"}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}

async function validateData(form){
    let existData = false;
    for(const d in form){
        if(form[d]){
            existData = true;
        }
    }
    return existData == true ? {success:true,msg:'hay almenos un dato'} : {success:false,msg:"No puede crearse un formulario vacio"}
}

export default ExamenFisico;


import model from '../models';

const {consulta} = model; 
const { paciente } = model;

class Consultas {
    static async create(req,res){
        const {motivo,enfermedadActual,signosVitales} = req.body;
        const {id_paciente,id_medico} = req.params;
        const validateDatas = await datas(motivo,enfermedadActual,id_paciente,id_medico);
        if(validateDatas.success == false) return res.status(200).json(validateDatas);
        try {
            const resp = await consulta.create({
                motivo,
                enfermedadActual,
                signosVitales,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"se creo una consulta",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
        
    }
    static async consultaPaciente (req,res){
        const { id_paciente } = req.params;
        const veriFyPaciente = await validationPaciente(id_paciente);
        if(veriFyPaciente.success == false) return res.status(400).json(veriFyPaciente)
        try {
            const resp = await consulta.findAll({
                where:{id_paciente}
            });
            res.status(200).json({
                success:true,
                msg:"Lista de consultas del paciente",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        } 
    }
    static async oneConsulta (req,res){
        const { id_consulta } = req.params;
        try {
            const resp = await consulta.findOne({
                where:{id:id_consulta}
            });
            if(resp){
                res.status(200).json({
                    success:true,
                    msg:"Consulta",
                    resp
                })
                
            }else{
                res.status(200).json({
                    success:false,
                    msg:"No existe esa consulta"
                })
            }   
            
        } catch (error) {
            res.status(500).json(error);
        } 
    }
}
function datas(motivo,enfermedadActual,id_paciente,id_medico){
    if(!motivo) return {success:false,msg:"Motivo de consulta es obligatorio", name:'motivo'}
    if(!enfermedadActual) return {success:false,msg:"Efermedad actual es obligatorio", name:'enfermedadActual'}
    if(!id_paciente) return {success:false,msg:"No se esta mandando el id del paciente", name:'id_paciente'}
    if(!id_medico) return {success:false,msg:"No se esta mandando el id del medico", name:'id_medico'}
    return {success:true,msg:"puedes continuar"}

}
async function validationPaciente(id_paciente){
    try {
        const resp = await paciente.findOne({
            where:{id:id_paciente},
            attributes:['id']           
        })
        if(resp){
            return {success:true,msg:"si existe ese usario"}
        }else{
            return {success:false,msg:"no existe ese usario"}
        }

    } catch (error) {
        return {success:false,msg:"error 500"}
    }
}
export default Consultas;
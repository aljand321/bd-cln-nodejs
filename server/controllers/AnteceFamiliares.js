import model from '../models';

 const { antcFamiliares,medicoUser,paciente } = model;

 class AntecedentesFamiliares{
    static async create(req,res){
        const { padre,madre,hnos } = req.body;
        const { id_paciente, id_medico } = req.params;
        console.log(req.body,' asdasd')
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await antcFamiliares.create({
                padre,
                madre,
                hnos,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Se creo el antecedente familiar",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
    static async oneAntecedente(req,res){
        const { id_antecedente } = req.params;
        try {
            const resp = await antcFamiliares.findOne({
                where:{id:id_antecedente}
            });
            if(resp){
                res.status(200).json({
                    success:true,
                    msg:"antecedente",
                    resp
                })
            }else{
                res.status(400).json({
                    success:false,
                    msg:"No existe ese antecedente"
                })
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async list(req,res){
        const {id_paciente,id_medico}= req.params
        try {
            const resp = await antcFamiliares.findAll({
                where:{id_paciente}
            });
            let filterId = await resp.filter((data)=>{
                return data.id_medico == id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Lista de antecedentes de todos los pacientes",
                resp:id_medico == 'null' ? resp : filterId
            })
        } catch (error) {
            res.status(500).json(error);
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
        console.log(error)
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
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
 export default AntecedentesFamiliares
import model from '../models';

 const { antcPersonalesNoPtl,paciente,medicoUser } = model;
 class AntcPersonNoPatologicos{
    static async create(req,res){
        const { instruccion,fuma,bebe,alimentacion } = req.body;
        const { id_paciente,id_medico } = req.params;
        const verifyDatas = await validateDatas(instruccion,alimentacion);
        if(verifyDatas.success == false) return res.status(200).json(verifyDatas)
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await antcPersonalesNoPtl.create({
                instruccion,
                fuma,
                bebe,
                alimentacion,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Se creo el antecedente no patologicos",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
    static async list (req,res){
        const {id_paciente} = req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await antcPersonalesNoPtl.findAll({
                where:{id_paciente}
            }); 
            let arr = []
            for(let i = 0; i < resp.length; i++) {
                arr.push({
                    id:resp[i].id,
                    instruccion:resp[i].instruccion,
                    fuma:JSON.parse( resp[i].fuma ),
                    bebe:JSON.parse(resp[i].bebe),
                    alimentacion:resp[i].alimentacion,
                    id_medico:resp[i].id_medico,
                    createdAt:resp[i].createdAt
                }) 
            }
            res.status(200).json({
                success:true,
                msg:"lista de antecedentes personales no patologicos del paciente",
                resp:arr
            })      
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async oneAntecedentes(req,res){
        const { id_antecedente } = req.params;
        try {
            const resp = await antcPersonalesNoPtl.findOne({
                where:{id:id_antecedente}
            }); 
            if(resp) return 
            res.status(200).json({
                success:true,
                msg:"lista de antecedentes personales no patologicos",
                resp
            })      
        } catch (error) {
            res.status(500).json(error);
        }
    }
 }

async function validateDatas(instruccion,alimentacion){
    if(!instruccion) return {success:false,msg:"Instruccion es Obligatorio"}
    if(!alimentacion) return {success:false,msg:"Alimentacion es Obligatorio"}
    return {success:true, msg:"puedes continuar"}
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

 export default AntcPersonNoPatologicos;
import model from '../models';
const {antPediatricos,medicoUser,paciente} = model;
class AntPediatricos {
    static async create (req,res){
        const { pesoRn,tipodeParto,obsPerinatales} = req.body;
        const {id_medico,id_paciente}=req.params;
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        const verifyMedico = await validateMedico(id_medico);
        if(verifyMedico.success == false)return res.status(200).json(verifyMedico);
        const verifyDatas = await validateDatas(pesoRn,tipodeParto,obsPerinatales);
        if(verifyDatas.success == false)return res.status(200).json(verifyDatas)
        try {
            const resp = await antPediatricos.create({
                pesoRn,
                tipodeParto,
                obsPerinatales,
                id_paciente,
                id_medico                
            })
            res.status(200).json({
                success:true,
                msg:'Se creo antecedente pediatrico del paciente',
                resp
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async lisAntPediatricos(req,res){
        const {id_paciente,id_medico} = req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false)return res.status(200).json(verifyPaciente);
        try {
            const resp = await antPediatricos.findAll({
                where:{id_paciente}
            });            
            let data = await resp.filter((data)=>{
                return data.id_medico == id_medico
            })
            res.status(200).json({
                success:true,
                msg:'Antecedentes pediatricos del paciente',
                resp:id_medico == 'null' ? resp : data
            })
        } catch (error) {
            return res.status(500).json(error)
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

async function validateDatas(pesoRn,tipodeParto,obsPerinatales){
    if(!pesoRn) return {success:false,msg:'Peso es Obligatorio',name:'pesoRn'}
    if(!tipodeParto) return {success:false,msg:'Tipo de parto es obligatorio',name:'tipodeParto'}
    if(!obsPerinatales) return {success:false,msg:'Observacion es obligatorio',name:'obsPerinatales'}
    return {success:true,msg:"puedes continuar"}
}
export default AntPediatricos;
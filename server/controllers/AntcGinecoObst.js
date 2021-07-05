import model from "../models";

const { antcGinecoObst,paciente,medicoUser } = model;

class AntGinecoObst {
  static async create(req, res) {
    const {fecha,menarca,ritmo,fmu,gestaCesaria,abortos,nacidoVivos,mortinatos, plfcFamiliar} = req.body;
    const { id_paciente,id_medico } = req.params;
    const verifyMEdico = await validateMedico(id_medico);
    if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
    const verifyPaciente = await validatePaciente(id_paciente);
    if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente); 
    const verifyDatas = validateDatas(fecha,menarca,ritmo,fmu,gestaCesaria,abortos,nacidoVivos,mortinatos, plfcFamiliar);
    if(verifyDatas.success == false) return res.status(200).json(verifyDatas); 
    
    try {
      const resp = await antcGinecoObst.create({
        menarca,
        ritmo,
        fmu,
        gestaCesaria,
        abortos,
        nacidoVivos,
        mortinatos,
        plfcFamiliar,
        fecha,
        id_paciente,
        id_medico
      });
      res.status(200).json({
        success: true,
        msg: "Se creo el antecedente gineco obstetrico",
        resp,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  static async list(req,res){
    const {id_paciente}= req.params;
    try {
        const resp = await antcGinecoObst.findAll({
          where: {id_paciente}
        });
        res.status(200).json({
            success:true,
            msg:"Lista",
            resp
        })
    } catch (error) {
        res.status(500).json(error);
    }
  }
  static async oneAntecedente(req,res){
    const { id_antecedente } = req.params;
    try {
        const resp = await antcGinecoObst.findOne({
            where:{id:id_antecedente}
        });
        if(resp){
            res.status(200).json({
                success:true,
                msg:"Antecedente gineco obstetrico",
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
}
async function validateDatas(fecha,menarca,ritmo,fmu,gestaCesaria,abortos,nacidoVivos,mortinatos,plfcFamiliar){
    if(!fecha)return {success:false, msg:"Fecha no se esta mandando"};
    if(!menarca)return {success:false, msg:"Menarca no se esta mandando"};
    if(!ritmo)return {success:false, msg:"la fecha no se esta mandando"};
    if(!fmu)return {success:false, msg:"la fecha no se esta mandando"};
    if(!gestaCesaria)return {success:false, msg:"la fecha no se esta mandando"};
    if(!abortos)return {success:false, msg:"la fecha no se esta mandando"};
    if(!nacidoVivos)return {success:false, msg:"la fecha no se esta mandando"};
    if(!mortinatos)return {success:false, msg:"la fecha no se esta mandando"};
    if(!plfcFamiliar)return {success:false, msg:"la fecha no se esta mandando"};
    return {success:true,msg:"puedes continuar"}    
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
export default AntGinecoObst;

import model from "../models";

const { antcGinecoObst,paciente,medicoUser } = model;

class AntGinecoObst {
  static async create(req, res) {
    const {ritmo,fum,gesta,partos,cesarea,abortos,plfcFamiliar} = req.body;
    const { id_paciente,id_medico } = req.params;
    console.log(req.body, 'esto es lo que quiero ver')
    const verifyMEdico = await validateMedico(id_medico);
    if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);
    const verifyPaciente = await validatePaciente(id_paciente);
    if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente); 
    const verifyDatas = validateDatas(ritmo,fum,gesta,partos,cesarea,abortos,plfcFamiliar);
    if(verifyDatas.success == false) return res.status(200).json(verifyDatas); 
    
    try {
      const resp = await antcGinecoObst.create({
        ritmo,
        fum,
        gesta,
        partos,
        cesarea,
        abortos,
        plfcFamiliar,
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
    const {id_paciente,id_medico}= req.params;
    const verifyPaciente = await validatePaciente(id_paciente);
    console.log(verifyPaciente,' sssssssssssssssssssssssssssssss')
    if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente); 
    try {
        const resp = await antcGinecoObst.findAll({
          where: {id_paciente}
        });
        let filterId = await resp.filter((data) =>{
          return data.id_medico == id_medico;
        })
        res.status(200).json({
            success:true,
            msg:"Lista",
            resp: id_medico == 'null' ? resp : filterId
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
async function validateDatas(ritmo,fum,gesta,partos,cesarea,abortos,plfcFamiliar){
  if(!ritmo)return {success:false, msg:"Ritmo es obligatorio"};
  if(!fum)return {success:false, msg:"FUM. es obligarorio"};
  if(!gesta)return {success:false, msg:"Gesta es obligarorio"};
  if(!partos)return {success:false, msg:"Partos es obligarorio"};
  if(!cesarea)return {success:false, msg:"Cesarea es obligarorio"};
  if(!abortos)return {success:false, msg:"Abortos es obligarorio"};
  if(!plfcFamiliar)return {success:false, msg:"Metodos de planificacion familiar es obligarorio"};
  return {success:true,msg:"puedes continuar"}    
}
async function validatePaciente(id_paciente){    
  if(!id_paciente) return {success:false,msg:"id del paciente no se esta mandando"}
  try {
      const resp = await paciente.findOne({
          where:{id:id_paciente}
      });
      console.log(resp.sexo);      
      if(resp){
        if(resp.sexo != "F") return {success:false, msg:"Este formulario solo es para mujeres"}
        return {success:true, msg:"puedes continuar"}
      }
      
      
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

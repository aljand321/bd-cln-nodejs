import model from "../models";

const { antcGinecoObst } = model;

class AntGinecoObst {
  static async create(req, res) {
    const {fecha,menarca,ritmo,fmu,gestaCesaria,abortos,nacidoVivos,mortinatos, plfcFamiliar} = req.body;
    const { id_paciente } = req.params;

    try {
      const resp = await antcGinecoObst.create({
        fecha,
        menarca,
        ritmo,
        fmu,
        gestaCesaria,
        abortos,
        nacidoVivos,
        mortinatos,
        plfcFamiliar,
        id_paciente,
      });
      res.status(200).json({
        success: true,
        msg: "Se creo el antecedente gineco obstetrico",
        resp,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async list(req,res){
    try {
        const resp = await antcGinecoObst.findAll();
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
}
export default AntGinecoObst;

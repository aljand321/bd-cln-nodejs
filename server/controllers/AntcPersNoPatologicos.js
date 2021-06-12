import model from '../models';

 const { antcPersonalesNoPtl } = model;
 class AntcPersonNoPatologicos{
    static async create(req,res){
        const { instruccion,fuma,bebe,alimentacion } = req.body;
        const { id_paciente } = req.params;
        //falta validaciones
        try {
            const resp = await antcPersonalesNoPtl.create({
                instruccion,
                fuma,
                bebe,
                alimentacion,
                id_paciente
            })
            res.status(200).json({
                success:true,
                msg:"Se creo el antecedente familiar",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async list (req,res){
        try {
            const resp = await antcPersonalesNoPtl.findAll(); 
            res.status(200).json({
                success:true,
                msg:"lista de antecedentes personales no patologicos",
                resp
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

 export default AntcPersonNoPatologicos;
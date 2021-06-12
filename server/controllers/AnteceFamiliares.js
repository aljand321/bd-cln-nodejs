import model from '../models';

 const { antcFamiliares } = model;

 class AntecedentesFamiliares{
    static async create(req,res){
        const { padre,madre,hnos,estSalud } = req.body;
        const { id_paciente } = req.params;
        //falta validaciones
        try {
            const resp = await antcFamiliares.create({
                padre,
                madre,
                hnos,
                estSalud,
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
        try {
            const resp = await antcFamiliares.findAll();
            res.status(200).json({
                success:true,
                msg:"Lista de antecedentes de todos los pacientes",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
 }
 export default AntecedentesFamiliares
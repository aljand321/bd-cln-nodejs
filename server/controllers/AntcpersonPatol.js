import model from '../controllers';

const { antcPersonalesPtl } = model;

class AntcPersonPtl{
    static async create(req,res){
        const { alergias,transfuciones,cirugiasPre,otrasEnf } = req.body;
        const { id_paciente } = req.params;
        try {
            const resp = await antcPersonalesPtl.create({
                alergias,
                transfuciones,
                cirugiasPre,
                otrasEnf,
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
}
export default AntcPersonPtl;
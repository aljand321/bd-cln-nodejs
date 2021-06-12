import model from '../models';

const { paciente } = model;

class Paciente {
    static async create(req,res){
        const { nombres,apellidos,sexo,direccion,edad,ocupacion } = req.body;
        const { id_medico } = req.params;
        const verifyDatas = await validateDatas(nombres,apellidos,sexo,direccion,edad,ocupacion,id_medico);
        if(verifyDatas.success == false) return res.status(400).json(verifyDatas)
        try {
            const resp = await paciente.create({
                nombres,
                apellidos,
                sexo,
                direccion,
                edad,
                ocupacion,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:"Se creo el paciente",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async list(req,res){
        try {
            const resp = await paciente.findAll();
            res.status(200).json({
                success:true,
                msg:"lista de pacientes",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async onePaciente(req,res){
        const { id_paciente } = req.params;
        try {
            const resp = await paciente.findOne({
                where:{id:id_paciente}
            });
            if(resp)return res.status(200).json({
                success:true,
                msg:"paciente",
                resp
            })
            return res.status(400).json({
                success:false,
                msg:"El paciente no exite"
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
async function validateDatas(nombres,apellidos,sexo,direccion,edad,ocupacion,id_medico){
    if(!nombres)return {success:false,msg:"Nombre del paciente es obligatorio"};
    if(!apellidos)return {success:false,msg:"Apellido del paciente es obligatorio"};
    if(!sexo)return {success:false,msg:"Sexo del paciente es obligatorio"};
    if(!direccion)return {success:false,msg:"Direccion del paciente es obligatorio"};
    if(!edad)return {success:false,msg:"Edad del paciente es obligatorio"};
    if(!ocupacion)return {success:false,msg:"Ocupacion del paciente es obligatorio"};
    if(!id_medico)return {success:false,msg:"El id del medico no se esta mandando"};
    return {success:true,msg:"puedes continuar"}
}
export default Paciente;
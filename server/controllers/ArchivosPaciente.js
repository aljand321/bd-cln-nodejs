import model from '../models';

const { archivosPaciente, paciente,medicoUser } = model;

class ArchivosPacientes {
    static async create(req,res){
        console.log(req.file);
        const {descripcion} = req.body;
        console.log(req.body,'esto es el cuerpo')
        const {id_paciente,id_medico} = req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        const verifyMedico = await validateMedico(id_medico);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        if(verifyMedico.success == false) return res.status(200).json(verifyMedico);
        if(!req.file) return res.status(200).json({success:false,msg:'no se esta mandando el archivo'})
        try {
            const resp = await archivosPaciente.create({
                descripcion,
                archivo:req.file.filename,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:'Se registro el archivo',
                resp
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    static async listArchivosPaciente(req,res){
        const {id_paciente} = req.params;
        const verifypaciente = await validatePaciente(id_paciente);
        if(verifypaciente.success == false) return res.starus(200).json(verifypaciente);
        try {
            const resp = await archivosPaciente.findAll({
                where:{id_paciente}
            });
            res.status(200).json({
                success:true,
                msg:'lista de archivos del paciente',
                resp
            })
        } catch (error) {
            console.log(error);
            res.status(200).json(error);
        }
    }
}

async function validatePaciente(id_paciente){
    if(!id_paciente) return {success:false,msg:'No se esta mandando el id del paciente'}
    try {
        const resp = await paciente.findOne({
            where:{id:id_paciente}
        })
        if(resp) return {success:true,msg:'Existe el paciente'};
        return {success:false,msg:'no existe el paciente'}
    } catch (error) {
        console.log(error)
        return {success:false,msg:'error 500'}
    }
}
async function validateMedico(id_medico){
    if(!id_medico) return {success:false,msg:'No se esta mandando el id del medico'}

    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        if(resp) return {success:true,msg:'Existe medico'};
        return {success:false,msg:'no existe el medico'}
    } catch (error) {
        console.log(error)
        return {success:false,msg:'error 500'}
    }
}
export default ArchivosPacientes;
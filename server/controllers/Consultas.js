import model from '../models';

const {paciente,consulta,medicoUser} = model; 

class Consultas {
    static async create(req,res){
        const {motivo,enfermedadActual,diagPresuntivo,conducta,signosVitales} = req.body;
        const {id_paciente,id_medico} = req.params;
        const validateDatas = await datas(motivo,enfermedadActual,diagPresuntivo,conducta,id_paciente,id_medico);
        if(validateDatas.success == false) return res.status(200).json(validateDatas);
        try {
            const resp = await consulta.create({
                motivo,
                enfermedadActual,
                diagPresuntivo,
                conducta,
                signosVitales,
                id_paciente,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"se creo una consulta",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
        
    }
    static async consultaPaciente (req,res){
        const { id_paciente,id_medico } = req.params;
        const veriFyPaciente = await validationPaciente(id_paciente);
        if(veriFyPaciente.success == false) return res.status(400).json(veriFyPaciente)
        try {
            const resp = await consulta.findAll({
                where:{id_paciente},
                include:[{
                    model:medicoUser,                    
                    attributes: ['nombres','apellidos']
                }] 
            });                     
            let consultas = await resp.filter(function(data){                
                return data.id_medico == id_medico
            })
            //si id del medico se manda null responde todas las consultas si no solo las del medico
            res.status(200).json({
                success:true,
                msg:"Lista de consultas del paciente",
                resp:id_medico == 'null' ? resp : consultas
            })
        } catch (error) {
            res.status(500).json(error);
        } 
    }    
    static async consultaMEdico (req, res) {        
        const {id_medico}=req.params;
        const {buscar}= req.query
        const verifyMedico = await validateMedico(id_medico);
        if(verifyMedico.success == false) return res.status(200).json(verifyMedico)
        try {
            /* const resp = await consulta.findAll({
                where: {id_medico},
                attributes:['id','id_medico','id_paciente'],
                include:{
                    model:paciente,
                    attributes:['id','nombres','apellidos','sexo','ci','telefono','direccion','edad','ocupacion']
                }
            });
            let filter = await resp.filter((data)=>{
                return  data.paciente.nombres.toLowerCase().includes(buscar.toLowerCase()) || 
                        data.paciente.apellidos.toLowerCase().includes(buscar.toLowerCase()) ||
                        data.paciente.ci.toLowerCase().includes(buscar.toLowerCase()) ||
                        data.paciente.telefono.toString().includes(buscar) 
            })
            res.status(200).json({
                success:true,
                msg:"lista de consultas que el medico registro",
                resp:filter
            }) */
            const resp = await paciente.findAll({
                include:{
                    model:consulta,
                    where:{id_medico},
                    attributes:['createdAt']
                }
            });
            let arr = [];
            let hoy = new Date();
            for(let i = 0; i < resp.length; i++){
                let fechaNacimiento = new Date(resp[i].edad)
                let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                arr.push({
                    id:resp[i].id,
                    nombres:resp[i].nombres,
                    apellidos:resp[i].apellidos,
                    sexo:resp[i].sexo,
                    ci:resp[i].ci,
                    telefono:resp[i].telefono,
                    direccion:resp[i].direccion,
                    edad:edad,
                    ocupacion:resp[i].ocupacion,
                })
            }
            let filter = await arr.filter((data)=>{
                return  data.nombres.toLowerCase().includes(buscar.toLowerCase()) || 
                        data.apellidos.toLowerCase().includes(buscar.toLowerCase()) ||
                        data.ci.toLowerCase().includes(buscar.toLowerCase()) ||
                        data.telefono.toString().includes(buscar) ||
                        data.edad.toString().includes(buscar)
            })
            res.status(200).json({
                success:true,
                msg:"lista de pacientes que el medico hizo una consulta", 
                resp:filter
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
    static async oneConsulta (req,res){
        const { id_consulta } = req.params;
        try {
            const resp = await consulta.findOne({
                where:{id:id_consulta}
            });
            if(resp){
                res.status(200).json({
                    success:true,
                    msg:"Consulta",
                    resp
                })
                
            }else{
                res.status(200).json({
                    success:false,
                    msg:"No existe esa consulta"
                })
            }   
            
        } catch (error) {
            res.status(500).json(error);
        } 
    }
}
async function datas(motivo,enfermedadActual,diagPresuntivo,conducta,id_paciente,id_medico){
    if(!motivo) return {success:false,msg:"Motivo de consulta es obligatorio", name:'motivo'}
    if(!enfermedadActual) return {success:false,msg:"Efermedad actual es obligatorio", name:'enfermedadActual'}
    if(!diagPresuntivo) return {success:false,msg:"Diagnostico presuntivo es obligatorio", name:'diagPresuntivo'}
    if(!conducta) return {success:false,msg:"Conducta es obligatorio", name:'conducta'}
    if(!id_paciente) return {success:false,msg:"No se esta mandando el id del paciente", name:'id_paciente'}
    if(!id_medico) return {success:false,msg:"No se esta mandando el id del medico", name:'id_medico'}
    const verifyMedico = await validateMedico(id_medico);
    if(verifyMedico.success == false) return verifyMedico
    return {success:true,msg:"puedes continuar"}

}
async function validationPaciente(id_paciente){
    try {
        const resp = await paciente.findOne({
            where:{id:id_paciente},
            attributes:['id']           
        })
        if(resp){
            return {success:true,msg:"si existe el paciente"}
        }else{
            return {success:false,msg:"no existe el paciente"}
        }

    } catch (error) {
        return {success:false,msg:"error 500"}
    }
}
async function validateMedico(id_medico){
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        if(resp) return {success:true,msg:"Si existe el medico", name:{nombres:resp.nombres,apellidos:resp.apellidos}}
        return {success:false,msg:"no existe ese medico"}
    } catch (error) {
        return {success:false,msg:"error 500"}
    }
}
async function getMedicoName(id_medico){
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        return resp.nombres
        
    } catch (error) {
        return {success:false,msg:"error 500"}
    }
}
export default Consultas;
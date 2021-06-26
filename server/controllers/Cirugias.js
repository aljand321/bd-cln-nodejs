import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {cirugiasPrevias,medicoUser,paciente,crPaciente} = model;

class Cirugias{
    static async create(req,res){
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(400).json(verifyMEdico);
        try {
            const resp = await cirugiasPrevias.create({
                nombre:nombre.trim(),
                descripcion,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:" Se crearon los datos",
                resp
            })
        } catch (error) {
            res.status(500).json(error)

        }
    } 
    static async createCirugiasPaciente(req,res){ // registrar transfuciones del paciente
        const {id_paciente, id_cirugiaP} = req.body
        const {id_medico}= req.params;
        const verifyCirugia = await validateCirugias(id_cirugiaP);
        if(verifyCirugia.success == false) return res.status(200).json(verifyCirugia);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyCirugiaPaciente = await existCirugiaPaciente(id_paciente, id_cirugiaP);
        if(verifyCirugiaPaciente.success == false) return res.status(200).json(verifyCirugiaPaciente);
        try {
            const resp = await crPaciente.create({
                id_paciente, 
                id_cirugiaP,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro la cirugia de ${verifyCirugia.nombre} al paciente`,
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }  
    static async listCirugiasPaciente(req,res){
        const {id_paciente}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await paciente.findAll({
                where:{id:id_paciente},
                include:[{
                    model:cirugiasPrevias,
                    attributes:['id','nombre','descripcion','createdAt'],
                    as:'cirugiasPrevias'
                    
                }],
                attributes:['id',]
            });
            res.status(200).json({
                success:true,
                msg:"Lista de Cirugias del paciente",
                resp
            })
        } catch (error) {            
            res.status(500).json(error)
        }
        
    }
    static async buscarCirugia(req,res){
        const {buscador}= req.body;    
        try {
            const resp = await cirugiasPrevias.findAll({
                limit : 8,
                offset: 0,
                where:{                    
                    [Op.or]: [
                        {nombre:{ [Op.iLike]: `${buscador}%`}},
                        {descripcion:{ [Op.iLike]: `${buscador}%`}}                        
                    ]                    
                },
                attributes:['id','nombre','descripcion','id_medico']
            });
            let datas = []
            for(let i = 0; i < resp.length; i++){
                datas.push({
                    id:resp[i].id,
                    nombre:resp[i].nombre,
                    descripcion:resp[i].descripcion,
                    id_medico:resp[i].id_medico,
                    selected:false
                })
            }
            res.status(200).json({
                success:true,
                msg:"lista de cirugias",
                resp:datas
            })
        } catch (error) {
            res.status(500).json(error)
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
async function validateNombre(nombre){
    if(!nombre) return {success:false,msg:"Nombre es obligatorio", name:'nombre'}
    try {
        const resp = await cirugiasPrevias.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        //console.log(resp, ' alskdjlaksjdlkajsdlkajsldkj')
        if(resp) return {success:false,msg:"Cirugia ya esta registrado", name:'nombre'}
        return {success:true,msg:"no existe Cirugia"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function validateCirugias(id_cirugiaP){
    if(!id_cirugiaP) return {success:false,msg:"no se seleciono cirugia"}
    try {
        const resp = await cirugiasPrevias.findOne({
            where:{id:id_cirugiaP}
        });
        if(resp) return {success:true,msg:"Existe cirugia",nombre:resp.nombre}
        return {success:false,msg:"No existe cirugia"}
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
async function existCirugiaPaciente(id_paciente, id_cirugiaP){
    const nombre = await validateCirugias(id_cirugiaP)
    try {
        const resp = await crPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_cirugiaP}]
            }
        });
        if(resp) return {success:false,msg:`${nombre.nombre}: Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"} 
    }
}
export default Cirugias;
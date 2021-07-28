import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {OtrasEnfermedades,medicoUser,paciente,otrasEnfPaciente} = model;

class OtrEnfermedades{
    static async create(req,res){
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(400).json(verifyMEdico);
        try {
            const resp = await OtrasEnfermedades.create({
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
    static async createOtrEnfPaciente(req,res){ // registrar enf del paciente
        const {id_paciente, id_otrasEnf} = req.body
        const {id_medico}= req.params;
        const verifyEnf = await validateEnf(id_otrasEnf);
        if(verifyEnf.success == false) return res.status(200).json(verifyEnf);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyEnfPaciente = await existCirugiaPaciente(id_paciente, id_otrasEnf);
        if(verifyEnfPaciente.success == false) return res.status(200).json(verifyEnfPaciente);
        try {
            const resp = await otrasEnfPaciente.create({
                id_paciente, 
                id_otrasEnf,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro ${verifyEnf.nombre} al paciente`,
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }  
    static async listEnfPaciente(req,res){
        const {id_paciente,id_medico}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await paciente.findAll({
                where:{id:id_paciente},
                include:[{
                    model:OtrasEnfermedades,
                    attributes:['id','nombre','descripcion','createdAt'],
                    as:'OtrasEnfermedades'
                    
                }],
                attributes:['id',]
            });
            let enf = await resp[0].OtrasEnfermedades.filter((data)=>{
                return data.otrasEnfPaciente.id_medico == id_medico;
            })
            res.status(200).json({
                success:true,
                msg:"Lista de Transfuciones del paciente",
                resp:id_medico == 'null' ? resp[0].OtrasEnfermedades : enf
            })
        } catch (error) {            
            res.status(500).json(error)
        }
        
    }
    static async buscarEnf(req,res){
        const {buscador,pagenumber,pagesize}= req.body;   
        const resp = await buscarEnf(buscador);
        if(resp.success == false) return res.status(200).json(resp);
        var pageNumber = pagenumber || 1;
        var pageSize = pagesize || 8;
        var enf = resp.alg
        var pageCount = Math.ceil(enf.length / pageSize);
        let pag = enf.slice((pageNumber - 1)*pageSize, pageNumber * pageSize);
        let datas = []
            for(let i = 0; i < pag.length; i++){
                datas.push({
                    id:pag[i].id,
                    nombre:pag[i].nombre,
                    descripcion:pag[i].descripcion,
                    id_medico:pag[i].id_medico,
                    selected:false
                })
            }
        res.status(200).json({
            success:true,
            msg:"lista de enfermedades",
            pageCount,
            resp:datas            
        });    
        /* try {
            const resp = await OtrasEnfermedades.findAll({
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
                msg:"Lista de enfermedades",
                resp:datas
            })
        } catch (error) {
            res.status(500).json(error)
        } */
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
        const resp = await OtrasEnfermedades.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        //console.log(resp, ' alskdjlaksjdlkajsdlkajsldkj')
        if(resp) return {success:false,msg:"Enfermedad ya esta registrado", name:'nombre'}
        return {success:true,msg:"no existe Enfermedad"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function validateEnf(id_otrasEnf){
    if(!id_otrasEnf) return {success:false,msg:"No se seleciono Enfermedad"}
    try {
        const resp = await OtrasEnfermedades.findOne({
            where:{id:id_otrasEnf}
        });
        if(resp) return {success:true,msg:"Existe enf",nombre:resp.nombre}
        return {success:false,msg:"No existe enf"}
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
async function existCirugiaPaciente(id_paciente, id_otrasEnf){
    const nombre = await validateEnf(id_otrasEnf)
    try {
        const resp = await otrasEnfPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_otrasEnf}]
            }
        });
        if(resp) return {success:false,msg:`${nombre.nombre}: Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"} 
    }
}
async function buscarEnf (buscador){    
    try {
        const resp = await OtrasEnfermedades.findAll({
            attributes:['id','nombre','descripcion','id_medico']
        });        
        const filter = resp.filter((data)=>{
            return data.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.descripcion.toLowerCase().includes(buscador.toLowerCase());
        })        
        return {success:true,msg:'Enfermedad encontradas', alg:filter}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
export default OtrEnfermedades;
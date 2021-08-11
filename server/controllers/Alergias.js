
import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { alergias,medicoUser,paciente,algPaciente } = model;

class Alergias{
    static async create (req,res){// crear un alaergia
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(400).json(verifyMEdico);
        try {
            const resp = await alergias.create({
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
    static async createAlgPaciente(req,res){ // registrar alergia del paciente
        const {id_paciente, id_alergia} = req.body
        const {id_medico}= req.params;
        const verifyAlergia = await validateAlergia(id_alergia);
        if(verifyAlergia.success == false) return res.status(200).json(verifyAlergia);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyAlergiaPaciente = await existAlergiaPaciente(id_paciente, id_alergia);
        if(verifyAlergiaPaciente.success == false) return res.status(200).json(verifyAlergiaPaciente);
        try {
            const resp = await algPaciente.create({
                id_paciente, 
                id_alergia,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro ${verifyAlergia.nombre} al paciente`,
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async listALgPaciente(req,res){
        const {id_paciente,id_medico}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await paciente.findAll({
                where:{id:id_paciente},
                include:[{
                    model:alergias,
                    attributes:['id','nombre','descripcion','createdAt'],
                    as:'alergias'
                    
                }],
                attributes:['id',]
            });
            
            let alergia = await resp[0].alergias.filter((data)=>{               
                return data.algPaciente.id_medico == id_medico;
            });
            res.status(200).json({
                success:true,
                msg:"Lista de alergias del paciente",
                resp: id_medico == 'null' ? resp[0].alergias :  alergia
            })
        } catch (error) {    
            console.log(error)        
            res.status(500).json(error)
        }
        
    }
    static async buscarAlergia(req,res){
        const {buscador,pagenumber,pagesize}= req.body;   
        const resp = await buscarAlergias(buscador);
        if(resp.success == false) return res.status(200).json(resp);
        var pageNumber = pagenumber || 0;
        var pageSize = pagesize || 8;
        var alergias = resp.alg
        var pageCount = Math.ceil(alergias.length / pageSize);
        let pag = alergias.slice(pageNumber*pageSize, (pageNumber + 1) * pageSize);
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
            msg:"lista de alergias",
            pageCount,
            pagenumber,
            resp:datas            
        });
    }
    static async oneAlergia(req,res){
        const {id_alergia}=req.params;
        const verifyAlergia = validateAlergia(id_alergia);
        if(verifyAlergia.success == false) return res.status(200).json(verifyAlergia);
        try {
            const resp = await alergias.findOne({
                where:{id:id_alergia}
            });
            if(resp) return res.status(200).json({
                success:true,
                msg:"Existe Alergia",
                resp
            })
            return res.status(200).json({
                success:false,
                msg:"No existe alergia"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async updateAlergia(req,res){
        const {nombre,descripcion}=req.body;  
              
        const {id_alergia}=req.params;
        console.log(nombre != '')
        if(nombre != ''){
            const verifyNombre = await validatenombreAlg(nombre);
            console.log(verifyNombre, 'esto es lo que quiero ver ffffff')
            if(verifyNombre.success == false) return res.status(200).json(verifyNombre)
        }
        if(descripcion){
            const verifyDescripcion = await validateDescripcionAlg(descripcion);
            if(verifyDescripcion.success == false) return res.status(200).json(verifyDescripcion)
        }
        try {
            const resp = await alergias.findOne({
                where:{id:id_alergia}
            })
            if(resp){
                const updatedata = await resp.update({
                    nombre:nombre || resp.nombre,
                    descripcion:descripcion || resp.descripcion
                })
                res.status(200).json({
                    success:true,
                    msg:'Se actualozo alergias',
                    resp:updatedata
                })
            }else{
                res.status(200).json({
                    success:false,
                    msg:'No existe esa alergia para poder actualizar'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}
async function validatenombreAlg (nombre){
    console.log('nombre', nombre )    
    
    try {
        const resp = await alergias.findOne({
            where:{nombre:nombre} 
        });                        
        console.log(resp,'esto es lo que quiro ver')
        if(resp){
            return {success:false,msg:"Ya esta registrado ese nombre",name:'nombre'}
        }else{
            return {success:true,msg:'Puedes continuar'}
        }
    } catch (error) {
        return {success:false,msg:"error 500"}
    }
    
}
async function validateDescripcionAlg (descripcion){
    console.log('descripcion', descripcion )    
    
    try {
        const resp = await alergias.findOne({
            where:{descripcion} 
        });                        
        console.log(resp,'esto es lo que quiro ver')
        if(resp){
            return {success:false,msg:"Ya esta registrado esa descripcion",name:'descripcion'}
        }else{
            return {success:true,msg:'Puedes continuar'}
        }
    } catch (error) {
        return {success:false,msg:"error 500"}
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
        const resp = await alergias.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        if(resp) return {success:false,msg:"Alergia ya esta registrado", name:'nombre'}
        return {success:true,msg:"no existe alergia"}
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
async function validateAlergia(id_alergia){
    if(!id_alergia) return {success:false,msg:"no se seleciono alergia"}
    try {
        const resp = await alergias.findOne({
            where:{id:id_alergia}
        });
        if(resp) return {success:true,msg:"Existe el alergia",nombre:resp.nombre}
        return {success:false,msg:"No existe alergia"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function existAlergiaPaciente(id_paciente, id_alergia){
    const nombre = await validateAlergia(id_alergia)
    try {
        const resp = await algPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_alergia}]
            }
        })
        if(resp) return {success:false,msg:`${nombre.nombre}: Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"} 
    }
}
async function buscarAlergias (buscador){    
    try {
        const resp = await alergias.findAll({
            attributes:['id','nombre','descripcion','id_medico'],
            order: [
                ['id', 'DESC'],
                /* ['name', 'ASC'], */
            ],
        });        
        const filter = resp.filter((data)=>{
            return data.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
                   data.descripcion.toLowerCase().includes(buscador.toLowerCase());
        })        
        return {success:true,msg:'Alergias encontradas', alg:filter}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
export default Alergias;
import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {transfuciones,medicoUser,paciente,trPaciente} = model;

class Transfuciones{
    static async create(req,res){
        const { nombre,descripcion } = req.body;
        const { id_medico } = req.params;
        const verifyNombre = await validateNombre(nombre);
        if(verifyNombre.success == false) return res.status(200).json(verifyNombre);
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(400).json(verifyMEdico);
        try {
            const resp = await transfuciones.create({
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
            console.log(error)
            res.status(500).json(error)

        }
    } 
    static async createTransfucionPaciente(req,res){ // registrar transfuciones del paciente
        const {id_paciente, id_transfucion} = req.body
        const {id_medico}= req.params;
        const verifyTr = await validateTransfucion(id_transfucion);
        if(verifyTr.success == false) return res.status(200).json(verifyTr);
        
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);

        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico);

        const verifyTrPaciente = await existTransfucionPaciente(id_paciente, id_transfucion);
        if(verifyTrPaciente.success == false) return res.status(200).json(verifyTrPaciente);
        try {
            const resp = await trPaciente.create({
                id_paciente, 
                id_transfucion,
                id_medico
            });
            res.status(200).json({
                success:true,
                msg:`Se registro ${verifyTr.nombre} al paciente`,
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }  
    static async listTransfucionesPaciente(req,res){
        const {id_paciente,id_medico}= req.params;
        const verifyPaciente = await validatePaciente(id_paciente);
        if(verifyPaciente.success == false) return res.status(200).json(verifyPaciente);
        try {
            const resp = await paciente.findAll({
                where:{id:id_paciente},
                include:[{
                    model:transfuciones,
                    attributes:['id','nombre','descripcion','createdAt'],
                    as:'transfuciones'
                    
                }],
                attributes:['id',]
            });
            let tr = await resp[0].transfuciones.filter((data) =>{
                return  data.trPaciente.id_medico == id_medico;
            })
            res.status(200).json({
                success:true,
                msg:"Lista de Transfuciones del paciente",
                resp:id_medico == 'null' ? resp[0].transfuciones : tr
            })
        } catch (error) {            
            res.status(500).json(error)
        }
        
    }
    static async buscarTransfucion(req,res){       
        const {buscador,pagenumber,pagesize}= req.body;   
        const resp = await buscarTransfucion(buscador);
        if(resp.success == false) return res.status(200).json(resp);
        var pageNumber = pagenumber || 0;
        var pageSize = pagesize || 8;
        var tr = resp.alg
        var pageCount = Math.ceil(tr.length / pageSize);
        let pag = tr.slice(pageNumber*pageSize, (pageNumber + 1) * pageSize);
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
            msg:"Lista de Transfuciones",
            pageCount,
            pagenumber,
            resp:datas            
        });        
    }
    static async oneTransfucion(req,res){
        const {id_transfucion}=req.params;
        const verifyCirugia = validateTransfucion(id_transfucion);
        if(verifyCirugia.success == false) return res.status(200).json(verifyCirugia);
        try {
            const resp = await transfuciones.findOne({
                where:{id:id_transfucion}
            });
            if(resp) return res.status(200).json({
                success:true,
                msg:"Existe Transfucion",
                resp
            })
            return res.status(200).json({
                success:false,
                msg:"No existe Transfucion"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async updateTransfucion(req,res){
        const {nombre,descripcion}=req.body;                
        const {id_transfucion}=req.params;

        if(nombre != ''){
            const verifyNombre = await validatenombre(nombre);
            if(verifyNombre.success == false) return res.status(200).json(verifyNombre)
        }
        if(descripcion){
            const verifyDescripcion = await validateDescripcion(descripcion);
            if(verifyDescripcion.success == false) return res.status(200).json(verifyDescripcion)
        }
        try {
            const resp = await transfuciones.findOne({
                where:{id:id_transfucion}
            })
            if(resp){
                const updatedata = await resp.update({
                    nombre:nombre || resp.nombre,
                    descripcion:descripcion || resp.descripcion
                })
                res.status(200).json({
                    success:true,
                    msg:'Se actualizo los datos',
                    resp:updatedata
                })
            }else{
                res.status(200).json({
                    success:false,
                    msg:'No hay nada para poder actualizar'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}
async function validatenombre(nombre){  
    try {
        const resp = await transfuciones.findOne({
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
async function validateDescripcion(descripcion){
    try {
        const resp = await transfuciones.findOne({
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
        const resp = await transfuciones.findOne({
            where:{                
                nombre:{ [Op.iLike]: `${nombre.trim()}%`}
            }
        });
        //console.log(resp, ' alskdjlaksjdlkajsdlkajsldkj')
        if(resp) return {success:false,msg:"Transfucion ya registrado", name:'nombre'}
        return {success:true,msg:"no existe transfucion"}
    } catch (error) {
        return {success:false,msg:"erro 500"}
    }
}
async function validateTransfucion(id_transfucion){
    if(!id_transfucion) return {success:false,msg:"no se seleciono transfucion"}
    try {
        const resp = await transfuciones.findOne({
            where:{id:id_transfucion}
        });
        if(resp) return {success:true,msg:"Existe transfucion",nombre:resp.nombre}
        return {success:false,msg:"No existe transfucion"}
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
async function existTransfucionPaciente(id_paciente, id_transfucion){
    const nombre = await validateTransfucion(id_transfucion)
    try {
        const resp = await trPaciente.findOne({
            where:{
                [Op.and]: [{id_paciente},{id_transfucion}]
            }
        });
        if(resp) return {success:false,msg:`${nombre.nombre}: Ya registrado`};
        return {success:true,msg:"No registrado en el paciente"}
    } catch (error) {
        return {success:false,msg:"erro 500"} 
    }
}
async function buscarTransfucion(buscador){    
    try {
        const resp = await transfuciones.findAll({
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
        return {success:true,msg:'Transfuciones encontradas', alg:filter}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
export default Transfuciones;
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
        const {id_paciente,id_medico}= req.params;
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
            let cir = await resp[0].cirugiasPrevias.filter((data)=>{
                return data.crPaciente.id_medico == id_medico;
            })
            res.status(200).json({
                success:true,
                msg:"Lista de Cirugias del paciente",
                resp: id_medico == 'null' ? resp[0].cirugiasPrevias : cir
            })
        } catch (error) {            
            res.status(500).json(error)
        }
        
    }
    static async buscarCirugia(req,res){
        const {buscador,pagenumber,pagesize}= req.body;   
        const resp = await buscarCirugias(buscador);
        if(resp.success == false) return res.status(200).json(resp);
        var pageNumber = pagenumber || 0;
        var pageSize = pagesize || 8;
        var cirugias = resp.alg
        var pageCount = Math.ceil(cirugias.length / pageSize);
        let pag = cirugias.slice( pageNumber * pageSize, (pageNumber + 1) * pageSize);
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
            msg:"lista de cirugias",
            pagenumber,
            pageCount,
            resp:datas            
        });  
    }
    static async oneCirugia(req,res){
        const {id_cirugia}=req.params;
        const verifyCirugia = validateCirugias(id_cirugia);
        if(verifyCirugia.success == false) return res.status(200).json(verifyCirugia);
        try {
            const resp = await cirugiasPrevias.findOne({
                where:{id:id_cirugia}
            });
            if(resp) return res.status(200).json({
                success:true,
                msg:"Existe Cirugia",
                resp
            })
            return res.status(200).json({
                success:false,
                msg:"No existe cirugia"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async updateCirugia(req,res){
        const {nombre,descripcion}=req.body;                
        const {id_cirugia}=req.params;

        if(nombre != ''){
            const verifyNombre = await validatenombre(nombre);
            if(verifyNombre.success == false) return res.status(200).json(verifyNombre)
        }
        if(descripcion){
            const verifyDescripcion = await validateDescripcion(descripcion);
            if(verifyDescripcion.success == false) return res.status(200).json(verifyDescripcion)
        }
        try {
            const resp = await cirugiasPrevias.findOne({
                where:{id:id_cirugia}
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
        const resp = await cirugiasPrevias.findOne({
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
        const resp = await cirugiasPrevias.findOne({
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
async function buscarCirugias (buscador){    
    try {
        const resp = await cirugiasPrevias.findAll({
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
        return {success:true,msg:'Cirugias encontradas', alg:filter}
    } catch (error) {
        console.log(error)
        return {success:false,msg:"erro 500"}
    }
}
export default Cirugias;
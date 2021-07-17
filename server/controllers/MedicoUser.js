import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { medicoUser,paciente } = model;

async function validateDatas(nombres,apellidos,ci,email,telefono,direccion,edad,cargo,especialidad,password,password1,role){
    if(!nombres)return {success:false,msg:"Nombre del medico es obligatorio",name:'nombres'};
    if(!apellidos)return {success:false,msg:"Apellido del medico es obligatorio",name:'apellidos'};
    if(!ci)return {success:false,msg:"C.I. es obligatorio",name:'ci'};
   
    if(!email)return {success:false,msg:"Email es obligatorio",name:'email'};
    if(!telefono)return {success:false,msg:"Telefono es obligatorio",name:'telefono'};
    if(telefono.length >= 10) return {success:false,msg:'Telefono solo acepta 9 caracteres como maximo',name:'telefono'}
    if(!direccion)return {success:false,msg:"Direccion es obligatorio",name:'direccion'};
    if(!edad)return {success:false,msg:"Edad del medico es obligatorio",name:'edad'};
    if(!cargo)return {success:false,msg:"Cargo es obligatorio",name:'cargo'};
    if(cargo === 'medico'){
        if(!especialidad)return {success:false,msg:"Especialdida del doctor es obligatorio",name:'especialidad'}; 
    }else if (cargo !== 'usuario'){
        return {success:false, msg:"cargo solo puede ser de usuario o medico no puede ser otra cosa"}
    }

    if(!password)return {success:false,msg:"Contracenia es obligatorio",name:'password'};
    if(!password1)return {success:false,msg:"Contracenia de confirmacion es obligatorio",name:'password1'};
    if(!role)return {success:false,msg:"Rol del usario es obligatorio",name:'role'};
    if(password != password1)return {success:false, msg:"las contracenias no son iguales",name:'password'};
    
    const validate = await verify(ci,email,telefono);
    //console.log(validate, ' asldijhalskdhj')
    if(validate.success == false)return validate;
    return {success:true,msg:"continuar"};
    
}
async function verify (ci,email,telefono){
    try {
        const resp = await medicoUser.findOne({
            where:{
                [Op.or]: [{ci},{email},{telefono}]
            }
        });
        if(resp){
            console.log(resp['ci'] == ci)
            if(resp['ci'] == ci)return {success:false,msg:"C.I. ya esta registrado",name:"ci"}
            if(resp['email'] == email)return {success:false,msg:"Email ya esta registrado",name:"email"}
            if(resp['telefono'] == telefono)return {success:false,msg:"Telefono ya esta registrado",name:"telefono"}
        }
        return {success:true,msg:"Puedes continuar"}
    } catch (error) {
        console.log(error);
        return { success:false,msg:"Error 500",error }
    }
}

class MedicoUser {
    static async create(req,res){
        const { nombres,apellidos,ci,email,telefono,direccion,edad,cargo,especialidad,img,password,password1,role } =  req.body; 
        const {id_medicoUser}=  req.params
        const verifyMedicoUser = await validateMedicoUser(id_medicoUser, role);
        if(verifyMedicoUser.success == false) return res.status(200).json(verifyMedicoUser)
        const verifyDatas = await validateDatas(nombres,apellidos,ci,email,telefono,direccion,edad,cargo,especialidad,password,password1,role);       
        if(verifyDatas.success == false)return res.status(200).json(verifyDatas)
        try {
            const resp = await medicoUser.create({
                nombres,
                apellidos,
                ci,
                email,
                telefono,
                direccion,
                edad,
                cargo,
                especialidad : cargo == 'medico' ? especialidad : '',
                img,
                password,
                role: cargo == 'usuario' ? 'usuario' : role
            });
            res.status(200).json({
                success:true,
                msg:"Se creo un usario",
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async list(req,res){
        try {
            const resp = await medicoUser.findAll({
                where:{cargo:'medico'},
                attributes:['id','nombres','apellidos','ci','email','telefono','direccion','edad','cargo','especialidad','img',]
            });
            res.status(200).json({
                success:true,
                msg:"Lista de usuarios",
                resp
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    static async oneUser(req,res){
       
        const { id_medico } = req.params;
       
        try {
            const resp = await medicoUser.findOne({
                where:{id:id_medico},
                attributes:['id', 'nombres','apellidos','ci','email','telefono','direccion','edad','cargo','especialidad','role']
            });
            if(resp)return res.status(200).json({
                success:true,
                msg:"Usuario",
                resp
            });
            return res.status(400).json({
                success:false,
                msg:"No exite usario"
            })
        } catch (error) {
            //console.log (error)
            return res.status(500).json(error)
        }
    }
    static async updateUser(req,res){
        const {nombres,apellidos,ci,email,telefono,direccion,edad,especialidad} = req.body;        
        const { id_medico } = req.params;
        const verifyUser = await validateUser(id_medico);
        if(verifyUser.success == false) return res.status(200).json(verifyUser);
        const validate = await verify(ci,email,telefono);
        if(ci || email || telefono){
            if(validate.success == false)return res.status(200).json(validate);
        }
        
        try {
            const resp = await medicoUser.findOne({
                where:{id:id_medico} 
            });
            if(resp){
                const updateData = await resp.update({
                    nombres: nombres || resp.nombres,
                    apellidos: apellidos || resp.apellidos,
                    ci: ci || resp.ci,
                    email: email || resp.email,
                    telefono: telefono === 0 ?  resp.telefono : telefono,
                    direccion: direccion || resp.direccion,
                    edad: edad || resp.edad,
                    cargo:'medico',
                    especialidad: especialidad || resp.especialidad,
                });
                res.status(200).json({
                    success:true,
                    msg:"Se actualizo los datos",
                    resp:updateData
                });
            }else{
                res.status(400).json({
                    success:false,
                    msg:"No hay nada para actualizar"
                });
            }
        } catch (error) {
            res.status(500).json(error)
        }
        
    }
    static async deleteUser(req,res){
        const { id_user } = req.params;
        console.log(id_user)
        try {
            const medico = await medicoUser.findOne({
                where:{id:id_user}
            });
            if(medico){
                await medico.destroy();
                res.status(200).json({
                    success:true,
                    msg:"Se elmino el medico",
                    medico
                })
            }else{
                res.status(400).json({
                    success:false,
                    msg:"No hay medico para eliminar"
                })
            }
        } catch (error) {
            res.status(500),json(error)
        }
    }
    static async getList(req,res){
        try {
            const resp = await medicoUser.findAll();
            if(resp.length > 0 )return res.status(200).json({
                success:true,
                msg:"Existe almenos un usuario",
            })
            return res.status(200).json({
                success:false,
                msg:"No existe usarios"
            })
        } catch (error) {
            res.status(500),json(error)
        }
    }
    static async lisPacientesMEdico(req,res){
        const {buscador}= req.body
        const {id_medico}= req.params;
        const verifyMEdico = await validateMedico(id_medico);
        if(verifyMEdico.success == false) return res.status(200).json(verifyMEdico)
        try {
            const resp = await paciente.findAll({
                where:{id_medico},
                attributes:['id','nombres','apellidos','edad','ci','telefono','direccion','ocupacion','sexo','id_medico']
            });
            let arr = []
            let hoy = new Date();
            
            for(let i = 0; i < resp.length; i++) {
                if(resp[i].edad){
                    let fechaNacimiento = new Date(resp[i].edad)
                    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                    arr.push({
                        id:resp[i].id,
                        nombres:resp[i].nombres,
                        apellidos:resp[i].apellidos,
                        edad:edad,
                        ci:resp[i].ci,
                        telefono:resp[i].telefono,
                        direccion:resp[i].direccion,
                        ocupacion:resp[i].ocupacion,
                        sexo:resp[i].sexo,
                        id_medico:resp[i].id_medico,
                    })
                }
                else{
                    arr.push({
                        id:resp[i].id,
                        nombres:resp[i].nombres,
                        apellidos:resp[i].apellidos,
                        edad:resp[i].edad,
                        ci:resp[i].ci,
                        telefono:resp[i].telefono,
                        direccion:resp[i].direccion,
                        ocupacion:resp[i].ocupacion,
                        sexo:resp[i].sexo,
                        id_medico:resp[i].id_medico,
                    }) 
                }
            }
            let filtrar = await arr.filter((item)=>{
                return  item.nombres.toLowerCase().includes(buscador.toLowerCase()) ||
                        item.apellidos.toLowerCase().includes(buscador.toLowerCase()) ||
                        item.ci.toLowerCase().includes(buscador.toLowerCase()) ||
                        item.telefono.toString().includes(buscador) ||
                        item.edad.toString().includes(buscador)
            })
            res.status(200).json({
                success:true,
                msg:'Lista de pacientes del doctor',
                resp:filtrar
            })
        } catch (error) {
            res.status(500),json(error)
        }
    }
    static async listaUsers(req,res){
        try {
            const resp = await medicoUser.findAll({
                where: {role:'usuario'}
            });
            res.status(200).json({
                success:true,
                msg:"lista de usuarios",
                resp
            })

        } catch (error) {
            res.status(500),json(error)
        }
    }
}
async function validateUser(id_medico){
    if(!id_medico)return {success:false,msg:"No se esta mandando el id del usario"};
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        if(!resp)return {success:false,msg:"No existe ese Usario"};
        if(resp.role != 'admin') return {success:false,msg:'No tienes permiso para actualizar datos'}
        return {success:true,msg:"puedes actualizar"}
    } catch (error) {
        return {success:false,msg:"erro 500"};
    }
}
async function validateMedico(id_medico){
    if(!id_medico) return {success:false,msg:"No se esta mandando el id del medico"}
    try {
        const resp = await medicoUser.findOne({
            where: {id:id_medico}
        })
        if(resp) return {success:true,msg:'Existe medico'}
        return {success:false,msg:'No existe ese medico'}
    } catch (error) {
        return {success:false,msg:"erro 500"};
    }
}
async function validateMedicoUser(id_medicoUsers,role ){
    if(!id_medicoUsers) return {success:false,msg:"No se esta mandando el id del medico"}
    try {
        const resp = await medicoUser.findOne({
            where: {id:id_medicoUsers}
        })
        if(resp){  
            console.log(resp.role, 'esto es la respuesta que quiero ver')      
            console.log(resp.role == 'usuario' || resp.role ==  'medico', 'sssssssssssssssssssssssssssssssssssssss')    
            console.log(role == 'admin', '88888888888888888888888888')
            console.log(role, 'esto es el role')
            if (resp.role == 'usuario' || resp.role ==  'medico'){
                if (role == 'admin'){
                    return {success:false,msg:"No puedes crear un usuario con rol de administrador", name:'error'}
                }  
                return {success:true,msg:'Puedes continuar'}              
            }
            return {success:true,msg:'Existe medico'}
        }
        return {success:false,msg:'No existe ese medico', name:'error'}
    } catch (error) {
        return {success:false,msg:"erro 500"};
    }
}
export default MedicoUser;
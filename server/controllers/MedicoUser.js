import model from '../models';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { medicoUser } = model;

async function validateDatas(nombres,apellidos,ci,email,telefono,direccion,edad,especialidad,password,password1,role){
    if(!nombres)return {success:false,msg:"Nombre del medico es obligatorio"};
    if(!apellidos)return {success:false,msg:"Apellido del medico es obligatorio"};
    if(!ci)return {success:false,msg:"C.I. es obligatorio"};
    if(!email)return {success:false,msg:"Email es obligatorio"};
    if(!telefono)return {success:false,msg:"Telefono es obligatorio"};
    if(!direccion)return {success:false,msg:"Direccion es obligatorio"};
    if(!edad)return {success:false,msg:"Edad del medico es obligatorio"};
    if(!especialidad)return {success:false,msg:"Especialdida del doctor es obligatorio"};
    if(!password)return {success:false,msg:"Contracenia es obligatorio"};
    if(!password1)return {success:false,msg:"Contracenia de confirmacion es obligatorio"};
    if(!role)return {success:false,msg:"Rol del usario es obligatorio"};
    if(password != password1)return {success:false, msg:"las contracenias no son iguales"};
    
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
        const { nombres,apellidos,ci,email,telefono,direccion,edad,especialidad,img,password,password1,role } =  req.body;       
        const verifyDatas = await validateDatas(nombres,apellidos,ci,email,telefono,direccion,edad,especialidad,password,password1,role);       
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
                especialidad,
                img,
                password,
                role
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
                attributes:['id','nombres','apellidos','ci','email','telefono','direccion','edad','especialidad','img']
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
                attributes:['id', 'nombres','apellidos','ci','email','telefono','direccion','edad','especialidad','role']
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
        const { nombres,apellidos,ci,email,telefono,direccion } = req.body;
        const { id_user } = req.params;
        const validate = await verify(ci,email,telefono);
        if(ci || email || telefono){
            if(validate.success == false)return validate;
        }
        
        try {
            const resp = await medicoUser.findOne({
                where:{id:id_user} 
            });
            if(resp){
                const updateData = await resp.update({
                    nombres: nombres || resp.nombres,
                    apellidos: apellidos || resp.apellidos,
                    ci: ci || resp.ci,
                    email: email || resp.email,
                    telefono: telefono || resp.telefono,
                    direccion: direccion || resp.direccion
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
}
export default MedicoUser;
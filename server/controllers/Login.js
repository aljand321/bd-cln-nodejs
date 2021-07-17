import model from '../models';
const { medicoUser } = model;
const jwt = require('jsonwebtoken');
const config = require('../dataConfig');

class Login {
    static async login(req,res){
        const { ci,password } = req.body;
        console.log(req.body);
        if(!ci) return res.status(200).json({success:false,ms:"Id usario es obligatorio"});
        if(!password) return res.status(200).json({ success:false,msg:"Password es obligatorio"});
        try {
            const userMedico = await medicoUser.findOne({
                where:{ ci },
                attributes:['id','nombres','apellidos','ci','email','telefono','direccion','cargo','role','password']
            });
            if (!userMedico) return res.status(200).json({success:false,msg:"Ese usario no exite",name:'ci'});
            userMedico.comparePassword(password, async (err, isMatch) =>{
                if(isMatch && ! err){
                    const token = await jwt.sign({medico:userMedico}, config.secret, {expiresIn:'1h'});
                    res.status(200).json({
                        success:true,
                        token: `JWT ${token}`,
                        data:{
                            id:userMedico.id,
                            nombres:userMedico.nombres,
                            apellidos:userMedico.apellidos,
                            ci:userMedico.ci, 
                            email:userMedico.email,
                            telefono:userMedico.telefono,
                            direccion:userMedico.direccion,
                            role:userMedico.role
                        }
                    })
                }else{
                    res.status(200).json({
                        success:false,
                        msg:"Contraceña incorrecta",
                        name:"password"
                    });
                }
            })
            
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async createFirstUser(req,res){
        const {nombres,apellidos,ci,password,password1} = req.body;      
        const validateFirtsUser = await verifiFirtsUser();
        if(validateFirtsUser.success == false) return res.status(200).json(validateFirtsUser);
        const veriFyDatas = await validateDatas(nombres,apellidos,ci,password,password1);
        if(veriFyDatas.success == false) return res.status(200).json(veriFyDatas);
        try {
            const resp = await medicoUser.create({
                nombres,
                apellidos,
                ci,                
                password,
                role:'admin'
            })
            res.status(200).json({
                success:true,
                msg:"Se creo el usario",
                resp
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async verifyToken (req,res){
        res.status(200).json({
            success:true,
            msg:"tienes permiso"
        })
    }
}

async function verifiFirtsUser(){
    try {
        const resp = await medicoUser.findAll();
        if(resp.length == 0)return {success:true,msg:"No hay usuarios"};
        return {success:false,msg:"Ya no se puede user esta ruta para poder crear mas usarios"}
    } catch (error) {
        return {success:false,msg:"error 500"};
    }
}

async function validateDatas(nombres,apellidos,ci,password,password1){
    if(!nombres) return {success:false,msg:"Nombre es obligatorio", name:'nombres'};
    if(!apellidos) return {success:false,msg:"Apellido es obligatorio", name:'apellidos'};
    if(!ci) return {success:false,msg:"C.I. es obligatorio", name:'ci'};
    if(!password) return {success:false,msg:"Contraceña es obligatorio", name:'password'};
    if(!password1) return {success:false,msg:"Verificacion de contraceña es obligatorio", name:'password1'};
    if(password != password1) return {success:false,msg:"Las contraceña no son iguales", name:'password'};
    return {success:true,msg:"Puedes continuar"}
}

export default Login;
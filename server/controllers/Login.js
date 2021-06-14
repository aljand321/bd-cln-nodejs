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
                attributes:['id','nombres','apellidos','ci','email','telefono','direccion','password']
            });
            if (!userMedico) return res.status(200).json({success:false,msg:"Ese usario no exite"});
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
                            direccion:userMedico.direccion
                        }
                    })
                }else{
                    res.status(200).json({
                        success:false,
                        msg:"Contraceña incorrecta"
                    });
                }
            })
            
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default Login;
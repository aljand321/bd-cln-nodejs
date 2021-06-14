const jwt = require('jsonwebtoken');

const config = require('../dataConfig');

module.exports = async function(req,res,next){
    const ruta = req.path, method = req.method;
    const headerToken = req.headers.c_token
   
    if(headerToken){
        const token = headerToken.split(' ')[1];
        const verifyToken = await validateToken(token);
        //console.log(verifyToken)
        if(verifyToken.success == false)return res.status(400).json(verifyToken);
        next();
    }else{
        const permisos = await tokenNull(ruta, method);
        if(permisos.success == false) return res.status(400).json(permisos);
        next();
    }
    

}
async function validateToken(token){
    try {
        const verify = await jwt.verify(token, config.secret)
        return {success:true,msg:"Token valido", verify};
    } catch (error) {
        return { success:false,msg:"Token expirado o no valido" };
    }
}
function tokenNull(r,m){
    
    const ruta = r.split("/")[2];
    console.log(ruta,'ruta', m,'method');
    const msg = [
        {success:true, msg:"Tienes permiso"},
        {success:false, msg:" No tienes permiso"}
    ]
    if(ruta == 'login'){
        return msg[0];
    }else if(ruta == 'getList'){
        return msg[0];
    }else if(ruta == 'medico'){
        if(m == 'GET') return msg[1];
        if(m == 'POST') return msg[0];
        if(m == 'PUT') return msg[1]
    }else{
        return msg[1]
    }
    
}
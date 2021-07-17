const jwt = require('jsonwebtoken');

const config = require('../dataConfig');
//roles permitidos
//usuario
//medico
//admin

function permits(user, ruta){
   
    let r = ruta.split('/')[2]
    if(user.role == 'medico'){
        let rutaMedico = {
            verifyToken:'/api/verifyToken',
            //paciente
            paciente:'/api/paciente/:id_medico',
            pacientes:'/api/pacientes',
            buscarPaciente:'/api/buscarPaciente',
            onePaciente:'/api/onePaciente/:id_paciente',
            //consulta paciente
            consulta:'/api/consulta/:id_paciente/:id_medico',
            oneConsulta:'/api/oneConsulta/:id_consulta',
            consultasMedico:'/api/consultasMedico/:id_medico',
            //Alergias
            alergias:'/api/alergias/:id_medico',
            pacienteAlergias:'/api/pacienteAlergias/:id_medico',
            buscarAlergia:'/api/buscarAlergia',
            // transfuciones
            transfcion:'/api/transfcion/:id_medico',
            pacienteTransfuciones:'/api/pacienteTransfuciones/:id_medico',
            buscarTransfucion:'/api/buscarTransfucion',
            //cirugias previas
            cirugias:'/api/cirugias/:id_medico',
            pacienteCirugias:'/api/pacienteCirugias/:id_medico',
            buscarCirugia:'/api/buscarCirugia',
            //otras enfermedades
            otrEnfermedades:'/api/otrEnfermedades/:id_medico',
            pacienteEnfermedades:'/api/pacienteEnfermedades/',
            buscarEnfermedad:'/api/buscarEnfermedad',
            //antecedentes no patologicos
            antecedentesNoPtl:'/api/antecedentesNoPtl/:id_medico/:id_paciente',
            antNoPtlPaciente:'/api/antNoPtlPaciente/:id_paciente/:id_medico',
            oneAntNoPtl:'/api/oneAntNoPtl/:id_antecedente',
            //antecedentes familiares
            createAntFamiliares:'/api/createAntFamiliares/:id_medico/:id_paciente',
            listAntFamiliares:'/api/listAntFamiliares/:id_paciente/:id_medico',
            //Examen fisico
            createExamenFisico:'/api/createExamenFisico/:id_medico/:id_paciente',
            listExFisPaciente:'/api/listExFisPaciente/:id_paciente/:id_medico',
            oneExamenFisico:'/api/oneExamenFisico/:id_examenFisico',
            //antecedentes gineco obstetricos
            createAntGincoObs:'/api/createAntGincoObs/:id_medico/:id_paciente',
            listAntGnbPaciente:'/api/listAntGnbPaciente/:id_paciente/:id_medico',
            //vacunas
            createVacuna:'/api/createVacuna/:id_medico',
            vacunaPaciente:'/api/vacunaPaciente/', 
            buscarVacuna:'/api/buscarVacuna/'

        }
        if(rutaMedico[r]){
            return true;
        }else{
            return false;
        }
    }
    if(user.role == 'usuario'){
        let rutaUser = {
            verifyToken:'/api/verifyToken',
            //medico 
            createMedico:'/api/createMedico/:id_medicoUser',
            getList:'/api/getList',
            medico:'/api/medico',
            listPasientemedico:'/api/listPasientemedico/:id_medico',
            listaUsers:'/api/listaUsers',
            //
            paciente:'/api/paciente/:id_medico',
            pacientes:'/api/pacientes',
            buscarPaciente:'/api/buscarPaciente',
            consultasMedico:'/api/consultasMedico/:id_medico'
        }
        if(rutaUser[r]){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = async function(req,res,next){
    const ruta = req.path, method = req.method;
    const headerToken = req.headers.c_token
    
    if(headerToken){
        const token = headerToken.split(' ')[1];
        const verifyToken = await validateToken(token);
        if(verifyToken.success == false)return res.status(400).json(verifyToken);
       
        if(verifyToken.verify.medico.role == 'admin'){
            return next();
        }    
        if(verifyToken.verify.medico.role == 'medico'){
            const verify = permits(verifyToken.verify.medico, ruta)
           
            if(verify == false){
                return res.status(200).json({
                    success: false,
                    msg:"No tienes permiso"
                })
            }
            return next();
        }  
        if(verifyToken.verify.medico.role == 'usuario'){
            const verify = permits(verifyToken.verify.medico, ruta)
           
            if(verify == false){
                return res.status(200).json({
                    success: false,
                    msg:"No tienes permiso"
                })
            }
            return next();
        }    
        
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
    const msg = [
        {success:true, msg:"Tienes permiso"},
        {success:false, msg:" No tienes permiso"}
    ]
    if(ruta == 'login'){
        return msg[0];
    }else if(ruta == 'getList'){
        return msg[0];
    }else if(ruta == 'createfirstUser'){
        if(m == 'GET') return msg[1];
        if(m == 'POST') return msg[0];
        if(m == 'PUT') return msg[1]
    }else{
        return msg[1]
    }
    
}
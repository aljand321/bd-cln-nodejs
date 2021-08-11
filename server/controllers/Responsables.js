import model from '../models';
const {responsable,medicoUser} = model

class Responsables {
    static async create (req,res){
        const {nombres,apellidos,fechaNacimineto,sexo,ci,telefono,direccion,ocupacion} = req.body;
        const { id_medico } = req.params
        
        try {
            const resp = await responsable.create({
                nombres,
                apellidos,
                fechaNacimineto,
                sexo,
                ci,
                telefono,
                direccion,
                ocupacion,
                id_medico
            })
            res.status(200).json({
                success:true,
                msg:"Se creo un aresponsable",
                resp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
};
async function datas(nombres,apellidos,fechaNacimineto,sexo,ci,telefono,direccion,ocupacion,id_medico){
    if(!nombres) return {success:false,msg:"Nombre del responsable es obligatorio", name:'nombres'};
    if(!apellidos) return {success:false,msg:"Apellido del responsable es obligatorio", name:'apellidos'};
    if(!fechaNacimineto) return {success:false,msg:"Fecha de nacimiento del responsable es obligatorio", name:'fechaNacimineto'};
    if(!sexo) return {success:false,msg:"Sexo del responsable es obligatorio", name:'sexo'};
    if(!ci) return {success:false,msg:"C.I. del responsable es obligatorio", name:'ci'};
    if(!telefono) return {success:false,msg:"Telefono del responsable es obligatorio", name:'telefono'};
    if(!direccion) return {success:false,msg:"Direccion del responsable es obligatorio", name:'direccion'};
    if(!ocupacion) return {success:false,msg:"Ocupacion del responsable es obligatorio", name:'ocupacion'};
    const verifyMedico = await validateMedico(id_medico);
    if(verifyMedico.success == false) return verifyMedico
    return {success:true,msg:"puedes continuar"}

}
async function validateMedico(id_medico){
    try {
        const resp = await medicoUser.findOne({
            where:{id:id_medico}
        })
        if(resp) return {success:true,msg:"Si existe el medico", name:{nombres:resp.nombres,apellidos:resp.apellidos}}
        return {success:false,msg:"no existe ese medico"}
    } catch (error) {
        return {success:false,msg:"error 500"}
    }
}
export default Responsables;
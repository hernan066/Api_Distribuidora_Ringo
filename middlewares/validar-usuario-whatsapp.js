const { Usuario } = require('../models');


const validarUsuarioWhatsapp = async ( req, res, next ) => {

    const usuario = await Usuario.findById(req.body.id)
    const telefono = usuario.telefono
   
    if( !usuario || !telefono ){
        return res.status(401).json({
            msg: `No se puede crear orden, porque no existe el usuario`
        });
    }

    next();
}



module.exports = {
    validarUsuarioWhatsapp
}
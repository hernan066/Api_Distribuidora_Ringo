const User = require("../models/user");

const validarUsuarioWhatsapp = async (req, res, next) => {
  const user = await User.findById(req.body.id);
  const phone = user.telefono;

  if (!user || !phone) {
    return res.status(401).json({
      msg: `No se puede crear orden, porque no existe el usuario`,
    });
  }

  next();
};

module.exports = {
  validarUsuarioWhatsapp,
};

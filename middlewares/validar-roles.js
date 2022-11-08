const { response } = require("express");
const { Role } = require("../models");


const isAdminRole = async (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero",
    });
  }

  const { role, name } = req.user;

  const userRole = await Role.findById(role);

  if (userRole.role !== process.env.ADMIN_ROLE) {
    return res.status(401).json({
      msg: `${name} no es administrador - No puede hacer esto`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  tieneRole,
};

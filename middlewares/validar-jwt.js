const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err){
        return res.sendStatus(403).json({
          msg: "Error de token",
        });
      } 
    });

    // leer el usuario que corresponde al uid
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        msg: "Token no válido - user no existe DB",
      });
    }

    // Verificar si el uid tiene estado true
    if (!user.state) {
      return res.status(401).json({
        msg: "Token no válido - user con estado: false",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};

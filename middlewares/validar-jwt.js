const jwt = require("jsonwebtoken");
// const User = require("../models/user");

const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
      token,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.UserInfo.id;
    req.role = decoded.UserInfo.role;
    next();
  });
};
/* const validarJWT = async (req , res  next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { UserInfo } = jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.sendStatus(401).json({
          msg: "Error de token",
        });
      }
    });
  
    // leer el usuario que corresponde al uid
    const user = await User.findById(UserInfo.id);

    console.log(user);

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
}; */

module.exports = {
  validarJWT,
};

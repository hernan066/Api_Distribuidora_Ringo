const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { Repartidor, User, Role } = require("../models");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const user = await User.findOne({ email });

    //return res.status(200).send(user)
    if (!user) {
      return res.status(400).json({
        msg: "user / Password no son correctos - correo",
      });
    }

    // SI el user está activo
    if (!user.state) {
      return res.status(400).json({
        msg: "user / Password no son correctos - state: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "user / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(user._id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};
const loginAdmin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    let role;
    const user = await User.findOne({ email });
    
    // Verificar si usuario existe
    if (user) {
      role = await Role.findById(user.role);
    }else{
        return res.status(400).json({
            msg: "Email o password no son correctos",
          });
    }

    
    // SI el user está activo
    if (!user.state) {
      return res.status(401).json({
        ok: false,
        status: 401,
        msg: "Email o password no son correctos",
      });
    }
    // SI no es admin
    if (role.role !== process.env.ADMIN_ROLE) {
      return res.status(403).json({
        ok: false,
        status: 403,
        msg: "Esta cuenta no tiene permisos de acceso",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        status: 401,
        msg: "Email o password no son correctos",
      });
    }

    // Generar el JWT
    const token = await generarJWT(user._id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};
const loginRepartidor = async (req, res = response) => {
  const { patente, password } = req.body;

  let patente1 = patente.toLowerCase();

  try {
    // Verificar si el email existe
    const repartidor = await Repartidor.findOne({ patente1 });
    if (!repartidor) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - patente",
      });
    }

    // SI el usuario está activo
    if (!repartidor.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, repartidor.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(repartidor.id);

    res.json({
      repartidor,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const getRevalidateToken = async (req, res = response ) => {
try {
  const { user} = req;

  // Generar JWT
  //const token = await generarJWT( uid, name );
  const token = await generarJWT(user._id);

  res.status(200).json({
      ok: true,
      user,
      token
  })
} catch (error) {
  res.status(500).json({
    ok: false,
    status: 500,
    msg: error.message,
  });
}
  
}

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = {
  login,
  loginRepartidor,
  googleSignin,
  loginAdmin,
  getRevalidateToken
};

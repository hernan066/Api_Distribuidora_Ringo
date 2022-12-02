const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { Repartidor, User, Role } = require("../models");
const jwt = require("jsonwebtoken");

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
    } else {
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

const getRevalidateToken = async (req, res = response) => {
  try {
    const { user } = req;

    // Generar JWT
    //const token = await generarJWT( uid, name );
    const token = await generarJWT(user._id);

    res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

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

//nuevo sistema de login para el dashboard
const login2 = async (req, res) => {
  const cookies = req.cookies;

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email o password no son correctos" });

  // Verificar si el email existe
  let role;
  const foundUser = await User.findOne({ email }).exec();

  if (foundUser) {
    role = await Role.findById(foundUser.role);
  } else {
    return res.status(401).json({
      msg: "Email o password no son correctos",
    });
  }
  // SI el user está activo
  if (!foundUser.state) {
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
  const validPassword = await bcryptjs.compare(password, foundUser.password);

  if (validPassword) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          role: role.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );
    const newRefreshToken = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_REFRESH,
      { expiresIn: "1d" }
    );

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* Posibles escenarios:
                1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
                2) RT es robado
                3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Se detecta rt reutilizado!
      if (!foundToken) {
        // se limpian todos los anteriores refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Se guarda el refreshToken en el usuario actual
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Se crea una Cookie segura con el refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Se envía el id del usuario y el rol en el token
    res.json({ accessToken });
  } else {
    return res.status(401).json({
      ok: false,
      status: 401,
      msg: "Email o password no son correctos",
    });
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({
      ok: false,
      status: 401,
      msg: "No autorizado",
    });
  }
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Se detecta reutilización de RT
  if (!foundUser) {
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); //Forbidden
      // Delete refresh tokens of hacked user
      const hackedUser = await User.findOne({ _id: decoded.id }).exec();
      hackedUser.refreshToken = [];
      const result = await hackedUser.save();
    });
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, decoded) => {
    if (err) {
      // expired refresh token
      foundUser.refreshToken = [...newRefreshTokenArray];
      const result = await foundUser.save();
    }
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

    // Refresh token was still valid
    //const roles = Object.values(foundUser.roles);
    const role = await Role.findById(foundUser.role);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: decoded.id,
          role: role.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    const newRefreshToken = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_REFRESH,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  });
};

const logout2 = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = {
  login,
  loginRepartidor,
  googleSignin,
  loginAdmin,
  getRevalidateToken,
  login2,
  refresh,
  logout2,
};

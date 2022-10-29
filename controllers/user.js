const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers");
const { User } = require("../models");

const userGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
    .skip(Number(desde))
    .limit(Number(limite)),
  ]);

  res.json({
    total,
    users,
  });
};

const userPost = async (req, res = response) => {
  const { name, lastName, email, password, rol, phone } = req.body;
  const user = new User({ name, lastName, email, password, rol, phone });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await user.save();

  const token = await generarJWT(user.id);

  res.json({
    user,
    token,
  });
};

const userPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, resto);

  res.json(user);
};



const userDelete = async (req, res = response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json(user);
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
};

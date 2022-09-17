const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Repartidor = require("../models/repartidor");

const repartidoresGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, repartidores] = await Promise.all([
    Repartidor.countDocuments(query),
    Repartidor.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    repartidores,
  });
};

const repartidoresPost = async (req, res = response) => {
  const { nombre, patente, password, rol } = req.body;

  

  const repartidor = new Repartidor({ 
    nombre, 
    patente: patente.toLowerCase(), 
    password, 
    rol 
  });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  repartidor.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await repartidor.save();
  

  res.json({
    repartidor,
  });
};

const repartidoresPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, patente, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const repartidor = await Repartidor.findByIdAndUpdate(id, resto);

  res.json(repartidor);
};

const repartidoresPatch = (req, res = response) => {
  res.json({
    msg: "patch API - repartidoresPatch",
  });
};

const reaprtidoresDelete = async (req, res = response) => {
  const { id } = req.params;
  const repartidor = await Repartidor.findByIdAndUpdate(id, { estado: false });

  res.json(repartidor);
};

module.exports = {
  repartidoresGet,
  repartidoresPost,
  repartidoresPut,
  repartidoresPatch,
  reaprtidoresDelete,
};

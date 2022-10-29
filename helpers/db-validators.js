const Role = require("../models/role");
const { Categoria, Producto, Repartidor, User } = require("../models");

const isValidRol = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExist = async (email = "") => {
  // Verificar si el correo existe
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`El email: ${email}, ya está registrado`);
  }
};
const phoneExist = async (phone) => {
  const existPhone = await User.findOne({ phone });
  if (existPhone) {
    throw new Error(`El teléfono: ${phone}, ya está registrado`);
  }
};
const patenteExiste = async (patente = "") => {
  // Verificar si el correo existe
  const existePatente = await Repartidor.findOne({ patente });
  if (existePatente) {
    throw new Error(`La patente: ${patente}, ya está registrada`);
  }
};

const existUserById = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existeRepartidorPorId = async (id) => {
  // Verificar si el correo existe
  const existeRepartidor = await Repartidor.findById(id);
  if (!existeRepartidor) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Categorias
 */
const existeCategoriaPorId = async (id) => {
  // Verificar si el correo existe
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Productos
 */
const existeProductoPorId = async (id) => {
  // Verificar si el correo existe
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La colección ${coleccion} no es permitida, ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  isValidRol,
  emailExist,
  existUserById,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
  existeRepartidorPorId,
  patenteExiste,
  phoneExist,
};

const Role = require("../models/role");
const {  Repartidor, User, Product, Category, Brand, Supplier, ProductLot, Ofert, DeliveryZone, DeliverySubZone } = require("../models");


const isValidRol = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};
const isRolbyId = async (id) => {
  const existeRol = await Role.findById( id );
  if (!existeRol) {
    throw new Error(`El rol no está registrado en la BD`);
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
const existCategoryById = async (id) => {
  // Verificar si el correo existe
  const existCategory = await Category.findById(id);
  if (!existCategory) {
    throw new Error(`El id no existe ${id}`);
  }
};
/**
 * Marcas
 */
const existBrandById = async (id) => {
  // Verificar si el correo existe
  const existBrand = await Brand.findById(id);
  if (!existBrand) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Productos
 */
const existProductById = async (id) => {
  // Verificar si el correo existe
  const existProduct = await Product.findById(id);
  if (!existProduct) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existSupplierById = async (id) => {
  // Verificar si el correo existe
  const exist = await Supplier.findById(id);
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existProductLotById = async (id) => {
  // Verificar si el correo existe
  const exist = await ProductLot.findById(id);
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existOfertById = async (id) => {
  // Verificar si el correo existe
  const exist = await Ofert.findById(id);
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existDeliveryZoneById = async (id) => {
  // Verificar si el correo existe
  const exist = await DeliveryZone.findById(id);
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existDeliverySubZoneById = async (id) => {
  // Verificar si el correo existe
  const exist = await DeliverySubZone.findById(id);
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existRoleById = async (id) => {
  // Verificar si el correo existe
  const exist = await Role.findById(id);
  if (!exist) {
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
  existCategoryById,
  existProductById,
  coleccionesPermitidas,
  existeRepartidorPorId,
  patenteExiste,
  phoneExist,
  existBrandById,
  existSupplierById,
  existProductLotById,
  existOfertById,
  existDeliveryZoneById,
  existDeliverySubZoneById,
  existRoleById,
  isRolbyId
};

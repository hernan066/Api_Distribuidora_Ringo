const { validateFields, validarJWT, esAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { existSupplierById } = require("../helpers");

const getSupplierValidator = [
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existSupplierById),
  validateFields,
];
const postSupplierValidator = [
  validarJWT,
  check("businessName", "La Razón Social es obligatoria").not().isEmpty(),
  check("cuit", "El CUIT es obligatorio").not().isEmpty(),
  check("email", "El email es obligatorio").not().isEmpty(),
  check("phone", "El telefono  es obligatorio").not().isEmpty(),
  check("address", "La dirección es obligatoria").not().isEmpty(),
  check("province", "La provincia es obligatoria").not().isEmpty(),
  check("city", "La ciudad es obligatoria").not().isEmpty(),
  check("zip", "El código postal es obligatorio").not().isEmpty(),
  validateFields,
];
const putSupplierValidator = [
  validarJWT,
  // check('categoria','No es un id de Mongo').isMongoId(),
  check("id").custom(existSupplierById),
  validateFields,
];
const deleteSupplierValidator = [
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existSupplierById),
  validateFields,
];

module.exports = {
  getSupplierValidator,
  postSupplierValidator,
  putSupplierValidator,
  deleteSupplierValidator,
};

const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { existClientAddressById } = require("../helpers");

const getClientAddressValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientAddressById),
  validateFields,
];
const postClientAddressValidator = [
  validarJWT,

  check("address", "La dirección es obligatoria").not().isEmpty(),
  check("province", "La provincia es obligatoria").not().isEmpty(),
  check("city", "La ciudad es obligatoria").not().isEmpty(),
  check("zip", "El código postal es obligatorio").not().isEmpty(),
  check("type", "El tipo es obligatorio").not().isEmpty(),
  validateFields,
];
const putClientAddressValidator = [
  validarJWT,
  check("id", "No es un id de Mongo").isMongoId(),
  check("id").custom(existClientAddressById),
  validateFields,
];
const deleteClientAddressValidator = [
  validarJWT,

  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientAddressById),
  validateFields,
];

module.exports = {
  getClientAddressValidator,
  postClientAddressValidator,
  putClientAddressValidator,
  deleteClientAddressValidator,
};

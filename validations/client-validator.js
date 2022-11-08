const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check} = require("express-validator");
const { existClientById, existUserById, existClientCategoryById, existClientTypeById } = require("../helpers");


const getClientValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientById),
  validateFields,
];
const postClientValidator = [
  validarJWT,
  check("userId", "No es un id de Mongo válido").isMongoId(),
  check("userId").custom(existUserById),
  check("clientCategoryId", "No es un id de Mongo válido").isMongoId(),
  check("clientCategoryId").custom(existClientCategoryById),
  check("clientTypeId", "No es un id de Mongo válido").isMongoId(),
  check("clientTypeId").custom(existClientTypeById),
  check("cuit", "El cuit es obligatorio").not().isEmpty(),
  validateFields,
];
const putClientValidator = [
  validarJWT,
  check('id','No es un id de Mongo').isMongoId(),
  check("id").custom(existClientById),
  validateFields,
];
const deleteClientValidator = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientById),
  validateFields,
];

module.exports = {
  getClientValidator,
  postClientValidator,
  putClientValidator,
  deleteClientValidator,
};

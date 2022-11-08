const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check} = require("express-validator");
const { existClientById, existUserById } = require("../helpers");


const getClientValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientById),
  validateFields,
];
const postClientValidator = [
  validarJWT,
  check("user", "No es un id de Mongo válido").isMongoId(),
  check("user").custom(existUserById),
  check("cuit", "El cuit es obligatorio").not().isEmpty(),
  /* TODO  clientCategory  clientType*/
  //check("clientCategory", "No es un id de Mongo válido").isMongoId(),
  //("clientCategory").custom(existClientCategoryById),
  //check("clientType", "No es un id de Mongo válido").isMongoId(),
  //check("clientType").custom(existClientTypeById),
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

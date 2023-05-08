const { check } = require("express-validator");
const { existClientById, existPointsById, existUserById } = require("../helpers");
const { validateFields, validarJWT, isAdminRole } = require("../middlewares");

const getAllPointsValidation = [validarJWT, isAdminRole, validateFields];
const getAllPointsByClientValidation = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existClientById),
  validateFields,
];
/* const postPointsValidation = [
  validarJWT,
  isAdminRole,
  check("clientId", "No es un id de Mongo válido").isMongoId(),
  check("clientId").custom(existClientById),
  
  check("recommendedClient", "No es un id de Mongo válido").isMongoId(),
  check("recommendedClient").custom(existClientById),
  
  check("recommendedUser", "No es un id de Mongo válido").isMongoId(),
  check("recommendedUser").custom(existUserById),
 
  validateFields,
]; */
const postPointsValidation = [
  validarJWT,
  isAdminRole,
  check("clientId", "No es un id de Mongo válido").isMongoId(),
  check("clientId").custom(existClientById),
  check("points", "Los puntos son obligatorios").not().isEmpty(),
  check("action", "La acción es obligatoria").not().isEmpty(),
  validateFields,
];

const putPointsValidation = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existPointsById),
  validateFields,
];

const deletePointsValidation = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existPointsById),
  validateFields,
];

module.exports = {
  getAllPointsValidation,
  getAllPointsByClientValidation,
  postPointsValidation,
  putPointsValidation,
  deletePointsValidation,
};

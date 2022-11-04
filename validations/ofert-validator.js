const { validateFields, validarJWT, esAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { existOfertById } = require("../helpers");


const getOfertValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existOfertById),
  validateFields,
];
const postOfertValidator = [
  validarJWT,
  check("product", "No es un id de Mongo válido").isMongoId(),
  check("description", "La descripción es obligatoria").not().isEmpty(),
  validateFields,
];
const putOfertValidator = [
  validarJWT,
  check('id','No es un id de Mongo').isMongoId(),
  check("id").custom(existOfertById),
  validateFields,
];
const deleteOfertValidator = [
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existOfertById),
  validateFields,
];

 

module.exports = {
  getOfertValidator,
  postOfertValidator,
  putOfertValidator,
  deleteOfertValidator,
};

const { validateFields, validarJWT, esAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { existProductLotById } = require("../helpers");


const getProductLotValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existProductLotById),
  validateFields,
];
const postProductLotValidator = [
  validarJWT,
  check("product", "El producto es obligatorio").not().isEmpty(),
  check("supplier", "El proveedor obligatorio").not().isEmpty(),
  check("quantity", "La cantidad  es obligatoria").not().isEmpty(),
  check("cost", "El costo es obligatorio").not().isEmpty(),
  validateFields,
];
const putProductLotValidator = [
  validarJWT,
  check('id','No es un id de Mongo').isMongoId(),
  check("id").custom(existProductLotById),
  validateFields,
];
const deleteProductLotValidator = [
  validarJWT,
  esAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existProductLotById),
  validateFields,
];

 

module.exports = {
  getProductLotValidator,
  postProductLotValidator,
  putProductLotValidator,
  deleteProductLotValidator,
};

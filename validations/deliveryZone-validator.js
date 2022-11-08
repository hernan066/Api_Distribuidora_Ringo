const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check} = require("express-validator");
const { existDeliveryZoneById } = require("../helpers");


const getDeliveryZoneValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existDeliveryZoneById),
  validateFields,
];
const postDeliveryZoneValidator = [
  validarJWT,
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("cost", "El costo es obligatorio").not().isEmpty(),
  check("province", "La provincia  es obligatoria").not().isEmpty(),
  check("city", "La ciudad es obligatoria").not().isEmpty(),
  check("zip", "El código postal es obligatorio").not().isEmpty(),
  validateFields,
];
const putDeliveryZoneValidator = [
  validarJWT,
  check('id','No es un id de Mongo').isMongoId(),
  check("id").custom(existDeliveryZoneById),
  validateFields,
];
const deleteDeliveryZoneValidator = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existDeliveryZoneById),
  validateFields,
];

module.exports = {
  getDeliveryZoneValidator,
  postDeliveryZoneValidator,
  putDeliveryZoneValidator,
  deleteDeliveryZoneValidator,
};

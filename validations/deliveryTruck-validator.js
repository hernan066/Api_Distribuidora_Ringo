const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check} = require("express-validator");
const { existDeliveryTruckById, existUserById, existDeliveryZoneById, existDistributorById } = require("../helpers");


const getDeliveryTruckValidator = [
  validarJWT,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existDeliveryTruckById),
  validateFields,
];
const postDeliveryTruckValidator = [
  validarJWT,
  check("userId", "No es un id de Mongo válido").isMongoId(),
  check("userId").custom(existUserById),
  check("distributorId", "No es un id de Mongo válido").isMongoId(),
  check("distributorId").custom(existDistributorById),
  check("deliveryZoneId", "No es un id de Mongo válido").isMongoId(),
  check("deliveryZoneId").custom(existDeliveryZoneById),
  check("deliveryName", "El nombre es obligatorio").not().isEmpty(),
  check("deliveryLastname", "El apellido es obligatorio").not().isEmpty(),
  check("patent", "La patente es obligatoria").not().isEmpty(),
  check("maximumLoad", "La carga maxima es obligatoria").not().isEmpty(),
  check("coldChamber", "Si posee cámara de frio es obligatorio").not().isEmpty(),
  validateFields,
];
const putDeliveryTruckValidator = [
  validarJWT,
  check('id','No es un id de Mongo').isMongoId(),
  check("id").custom(existDeliveryTruckById),
  validateFields,
];
const deleteDeliveryTruckValidator = [
  validarJWT,
  isAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existDeliveryTruckById),
  validateFields,
];

module.exports = {
  getDeliveryTruckValidator,
  postDeliveryTruckValidator,
  putDeliveryTruckValidator,
  deleteDeliveryTruckValidator,
};

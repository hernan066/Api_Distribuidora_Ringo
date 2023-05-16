const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existDeliverySubZoneById } = require('../helpers');

const getDeliverySubZoneValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existDeliverySubZoneById),
	validateFields,
];
const postDeliverySubZoneValidator = [
	validarJWT,
	check('deliveryZone', 'No es un id de Mongo').isMongoId(),
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	validateFields,
];
const putDeliverySubZoneValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existDeliverySubZoneById),
	check('deliveryZone', 'No es un id de Mongo').isMongoId(),
	validateFields,
];
const deleteDeliverySubZoneValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existDeliverySubZoneById),
	validateFields,
];

module.exports = {
	getDeliverySubZoneValidator,
	postDeliverySubZoneValidator,
	putDeliverySubZoneValidator,
	deleteDeliverySubZoneValidator,
};

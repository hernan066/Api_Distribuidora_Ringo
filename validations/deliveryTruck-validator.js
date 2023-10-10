const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existDeliveryTruckById, existUserById } = require('../helpers');

const getDeliveryTruckValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existDeliveryTruckById),
	validateFields,
];
const getUserDeliveryTruckValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existUserById),
	validateFields,
];
const postDeliveryTruckValidator = [
	validarJWT,
	/* check('user', 'No es un id de Mongo válido').isMongoId(),
	check('user').custom(existUserById),
	check('distributor', 'No es un id de Mongo válido').isMongoId(),
	check('distributor').custom(existDistributorById),
	check('defaultZone', 'No es un id de Mongo válido').isMongoId(),
	check('defaultZone').custom(existDeliveryZoneById), */
	check('patent', 'La patente es obligatoria').not().isEmpty(),
	check('maximumLoad', 'La carga maxima es obligatoria').not().isEmpty(),
	check('coldChamber', 'Si posee cámara de frio es obligatorio')
		.not()
		.isEmpty(),
	validateFields,
];
const putDeliveryTruckValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existDeliveryTruckById),
	validateFields,
];
const deleteDeliveryTruckValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existDeliveryTruckById),
	validateFields,
];

module.exports = {
	getDeliveryTruckValidator,
	postDeliveryTruckValidator,
	putDeliveryTruckValidator,
	deleteDeliveryTruckValidator,
	getUserDeliveryTruckValidator,
};

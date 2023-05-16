const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existClientTypeById } = require('../helpers');

const getClientTypeValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientTypeById),
	validateFields,
];
const postClientTypeValidator = [
	validarJWT,
	check('clientType', 'El nombre de la categoría es obligatorio')
		.not()
		.isEmpty(),
	validateFields,
];
const putClientTypeValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existClientTypeById),
	validateFields,
];
const deleteClientTypeValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientTypeById),
	validateFields,
];

module.exports = {
	getClientTypeValidator,
	postClientTypeValidator,
	putClientTypeValidator,
	deleteClientTypeValidator,
};

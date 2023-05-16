const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existClientCategoryById } = require('../helpers');

const getClientCategoryValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientCategoryById),
	validateFields,
];
const postClientCategoryValidator = [
	validarJWT,
	check('clientCategory', 'El nombre de la categoría es obligatorio')
		.not()
		.isEmpty(),
	validateFields,
];
const putClientCategoryValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existClientCategoryById),
	validateFields,
];
const deleteClientCategoryValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientCategoryById),
	validateFields,
];

module.exports = {
	getClientCategoryValidator,
	postClientCategoryValidator,
	putClientCategoryValidator,
	deleteClientCategoryValidator,
};

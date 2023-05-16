const { check } = require('express-validator');
const { existBrandById } = require('../helpers');
const { validateFields, validarJWT, isAdminRole } = require('../middlewares');

const getBrandValidation = [
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existBrandById),
	validateFields,
];
const postBrandValidation = [
	validarJWT,
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	validateFields,
];

const putBrandValidation = [
	validarJWT,
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	check('id').custom(existBrandById),
	validateFields,
];

const deleteBrandValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existBrandById),
	validateFields,
];

module.exports = {
	getBrandValidation,
	postBrandValidation,
	putBrandValidation,
	deleteBrandValidation,
};

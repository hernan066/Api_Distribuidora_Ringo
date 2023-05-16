const { check } = require('express-validator');
const { existCategoryById } = require('../helpers');
const { validateFields, validarJWT, isAdminRole } = require('../middlewares');

const getCategoryValidation = [
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existCategoryById),
	validateFields,
];
const postCategoryValidation = [
	validarJWT,
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	validateFields,
];

const putCategoryValidation = [
	validarJWT,
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	check('id').custom(existCategoryById),
	validateFields,
];

const deleteCategoryValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existCategoryById),
	validateFields,
];

module.exports = {
	getCategoryValidation,
	postCategoryValidation,
	putCategoryValidation,
	deleteCategoryValidation,
};

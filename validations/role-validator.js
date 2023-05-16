const { check } = require('express-validator');
const { existRoleById } = require('../helpers');
const { validateFields, validarJWT, isAdminRole } = require('../middlewares');

const getRolesValidation = [validarJWT, isAdminRole, validateFields];
const getRoleValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existRoleById),
	validateFields,
];
const postRoleValidation = [
	validarJWT,
	isAdminRole,
	check('role', 'El rol es obligatorio').not().isEmpty(),
	validateFields,
];

const putRoleValidation = [
	validarJWT,
	isAdminRole,
	check('role', 'El rol es obligatorio').not().isEmpty(),
	check('id').custom(existRoleById),
	validateFields,
];

const deleteRoleValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existRoleById),
	validateFields,
];

module.exports = {
	getRoleValidation,
	postRoleValidation,
	putRoleValidation,
	deleteRoleValidation,
	getRolesValidation,
};

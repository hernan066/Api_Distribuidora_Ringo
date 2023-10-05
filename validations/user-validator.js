const { check } = require('express-validator');
const {
	emailExist,
	phoneExist,
	isValidRol,
	existUserById,
	existRoleById,
} = require('../helpers');
const { validarJWT, validateFields, isAdminRole } = require('../middlewares');

const getUsersValidations = [validarJWT, validateFields];

const getUserValidations = [
	validarJWT,
	check('id', 'No es un ID válido').isMongoId(),
	check('id').custom(existUserById),
	check('rol').custom(isValidRol),
	validateFields,
];

const postUserValidations = [
	check('name', 'El nombre es obligatorio').not().isEmpty(),
	check('lastName', 'El nombre es obligatorio').not().isEmpty(),
	check('password', 'El password debe de ser más de 6 letras').isLength({
		min: 6,
	}),
	/* check('email', 'El email no es válido').isEmail(), */
	check('email').custom(emailExist),
	check('phone', 'El teléfono es obligatorio').not().isEmpty(),
	check('phone', 'Solo números').isNumeric(),
	check('phone').custom(phoneExist),
	check('role', 'No es un ID válido').isMongoId(),
	check('role').custom(existRoleById),
	validateFields,
];

const putUserValidations = [
	validarJWT,

	check('id', 'No es un ID válido').isMongoId(),
	check('id').custom(existUserById),
	validateFields,
];

const patchUserValidations = [
	validarJWT,
	check('id', 'No es un ID válido').isMongoId(),
	check('id').custom(existUserById),
	validateFields,
];

const deleteUserValidations = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un ID válido').isMongoId(),
	check('id').custom(existUserById),
	validateFields,
];

module.exports = {
	getUserValidations,
	postUserValidations,
	putUserValidations,
	deleteUserValidations,
	getUsersValidations,
	patchUserValidations,
};

const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const {
	existEmployeeById,
	existUserById,
	existEmployeeByDocket,
} = require('../helpers');

const getEmployeeValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existEmployeeById),
	validateFields,
];
const postEmployeeValidator = [
	validarJWT,
	check('userId', 'No es un id de Mongo válido').isMongoId(),
	check('userId').custom(existUserById),
	check('docket', 'El legajo es obligatorio').not().isEmpty(),
	check('docket').custom(existEmployeeByDocket),
	check('name', 'El legajo es obligatorio').not().isEmpty(),
	check('lastName', 'El legajo es obligatorio').not().isEmpty(),
	check('cuil', 'El CUIL es obligatorio').not().isEmpty(),
	check('email', 'El email es obligatorio').not().isEmpty(),
	check('phone', 'El telefono  es obligatorio').not().isEmpty(),
	check('address', 'La dirección es obligatoria').not().isEmpty(),
	check('province', 'La provincia es obligatoria').not().isEmpty(),
	check('city', 'La ciudad es obligatoria').not().isEmpty(),
	check('zip', 'El código postal es obligatorio').not().isEmpty(),
	validateFields,
];
const putEmployeeValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existEmployeeById),
	validateFields,
];
const deleteEmployeeValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existEmployeeById),
	validateFields,
];

module.exports = {
	getEmployeeValidator,
	postEmployeeValidator,
	putEmployeeValidator,
	deleteEmployeeValidator,
};

const { check } = require('express-validator');
const { existExpensesById } = require('../helpers');
const { validateFields, validarJWT, isAdminRole } = require('../middlewares');

const getExpensesValidation = [
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existExpensesById),
	validateFields,
];
const postExpensesValidation = [
	validarJWT,
	check('expensesName', 'El gasto es obligatorio').not().isEmpty(),
	check('category', 'La categoria del gasto es obligatorio').not().isEmpty(),
	check('amount', 'El monto es obligatorio').not().isEmpty(),
	validateFields,
];

const putExpensesValidation = [
	validarJWT,
	check('expensesName', 'El gasto es obligatorio').not().isEmpty(),
	check('category', 'La categoria del gasto es obligatorio').not().isEmpty(),
	check('amount', 'El monto es obligatorio').not().isEmpty(),
	check('id').custom(existExpensesById),
	validateFields,
];

const deleteExpensesValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existExpensesById),
	validateFields,
];

module.exports = {
	getExpensesValidation,
	postExpensesValidation,
	putExpensesValidation,
	deleteExpensesValidation,
};

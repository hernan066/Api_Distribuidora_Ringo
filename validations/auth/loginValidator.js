const { check } = require('express-validator');
const { validateFields } = require('../../middlewares');

const loginValidator = [
	check('email', 'El email es obligatorio').isEmail(),
	check('password', 'La contraseña es obligatoria').not().isEmpty(),
	validateFields,
];
const loginCashierSellerValidator = [
	check('email', 'El email es obligatorio').isEmail(),
	check('password', 'La contraseña es obligatoria').not().isEmpty(),

	validateFields,
];

module.exports = {
	loginValidator,
	loginCashierSellerValidator,
};

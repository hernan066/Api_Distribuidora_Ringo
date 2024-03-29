const { validateFields, validarJWT, isAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const {
	existOrderById,
	existUserById,
	existProductById,
	existClientById,
} = require('../helpers');

const getOrderValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existOrderById),
	validateFields,
];
const getOrderUserValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existUserById),
	validateFields,
];
const getOrderClientValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientById),
	validateFields,
];
const postOrderValidator = [
	validarJWT,
	check('userId', 'No es un id de Mongo válido').isMongoId(),
	check('userId').custom(existUserById),
	// orderItems
	check('orderItems[0].productId', 'No es un id de Mongo válido').isMongoId(),
	check('orderItems[0].productId').custom(existProductById),
	check('orderItems[0].totalQuantity', 'La cantidad es obligatoria')
		.not()
		.isEmpty(),
	check('orderItems[0].totalPrice', 'El precio es obligatorio').not().isEmpty(),
	check('orderItems[0].unitPrice', 'El precio es obligatorio').not().isEmpty(),
	// shippingAddress
	check('shippingAddress.name', 'El nombre  es obligatorio').not().isEmpty(),
	check('shippingAddress.lastName', 'El apellido  es obligatorio')
		.not()
		.isEmpty(),
	check('shippingAddress.phone', 'El telefono  es obligatorio').not().isEmpty(),
	check('shippingAddress.address', 'La dirección es obligatoria')
		.not()
		.isEmpty(),
	// other info

	check('numberOfItems', 'El numero de productos es obligatorio')
		.not()
		.isEmpty(),
	check('subTotal', 'El subtotal  es obligatorio').not().isEmpty(),
	check('total', 'El total  es obligatorio').not().isEmpty(),

	validateFields,
];
const postOrderLocalValidator = [
	validarJWT,
	/* check('userId', 'No es un id de Mongo válido').isMongoId(),
	check('userId').custom(existUserById), */
	// orderItems
	check('orderItems[0].productId', 'No es un id de Mongo válido').isMongoId(),
	check('orderItems[0].productId').custom(existProductById),
	check('orderItems[0].totalQuantity', 'La cantidad es obligatoria')
		.not()
		.isEmpty(),
	check('orderItems[0].totalPrice', 'El precio es obligatorio').not().isEmpty(),
	check('orderItems[0].unitPrice', 'El precio es obligatorio').not().isEmpty(),

	check('numberOfItems', 'El numero de productos es obligatorio')
		.not()
		.isEmpty(),
	check('subTotal', 'El subtotal  es obligatorio').not().isEmpty(),
	check('total', 'El total  es obligatorio').not().isEmpty(),

	validateFields,
];
const putOrderValidator = [
	validarJWT,
	check('id', 'No es un id de Mongo').isMongoId(),
	check('id').custom(existOrderById),
	validateFields,
];
const deleteOrderValidator = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existOrderById),
	validateFields,
];
const putOrderSetInactiveAllValidator = [validarJWT, isAdminRole];

module.exports = {
	getOrderValidator,
	postOrderValidator,
	putOrderValidator,
	deleteOrderValidator,
	getOrderUserValidator,
	getOrderClientValidator,
	postOrderLocalValidator,
	putOrderSetInactiveAllValidator,
};

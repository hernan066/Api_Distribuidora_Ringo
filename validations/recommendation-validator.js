const { check } = require('express-validator');
const {
	existClientById,
	existPointsById,
	existUserById,
} = require('../helpers');
const { validateFields, validarJWT, isAdminRole } = require('../middlewares');

const getAllRecommendationValidation = [
	validarJWT,
	isAdminRole,
	validateFields,
];
const getAllRecommendationByClientValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existClientById),
	validateFields,
];
const postRecommendationValidation = [
	validarJWT,
	isAdminRole,
	check('clientId', 'No es un id de Mongo válido').isMongoId(),
	check('clientId').custom(existClientById),

	check('recommendedClient', 'No es un id de Mongo válido').isMongoId(),
	check('recommendedClient').custom(existClientById),

	check('recommendedUser', 'No es un id de Mongo válido').isMongoId(),
	check('recommendedUser').custom(existUserById),

	validateFields,
];

const putRecommendationValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existPointsById),
	validateFields,
];

const deleteRecommendationValidation = [
	validarJWT,
	isAdminRole,
	check('id', 'No es un id de Mongo válido').isMongoId(),
	check('id').custom(existPointsById),
	validateFields,
];

module.exports = {
	getAllRecommendationValidation,
	getAllRecommendationByClientValidation,
	postRecommendationValidation,
	putRecommendationValidation,
	deleteRecommendationValidation,
};

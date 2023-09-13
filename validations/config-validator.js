const { validarJWT, isAdminRole } = require('../middlewares');

const getConfigValidation = [validarJWT, isAdminRole];
const putConfigValidation = [validarJWT, isAdminRole];

module.exports = {
	getConfigValidation,
	putConfigValidation,
};

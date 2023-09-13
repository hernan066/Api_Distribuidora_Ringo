const { Router } = require('express');
const {
	getConfig,
	putConfig,
	setConfigActiveClient,
} = require('../controllers/config');
const { putConfigValidation } = require('../validations/config-validator');
const router = Router();

/**
 * {{url}}/api/config
 */

router.get('/', getConfig);
router.put('/', putConfigValidation, putConfig);

// aplica la config de clientes activos e inactivos
router.post(
	'/setConfigActiveClient',
	putConfigValidation,
	setConfigActiveClient
);

module.exports = router;

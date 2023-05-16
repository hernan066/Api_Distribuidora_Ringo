const { Router } = require('express');
const {
	getClientTypes,
	getClientType,
	putClientType,
	deleteClientType,
	postClientType,
} = require('../controllers/clientType');
const {
	getClientTypeValidator,
	postClientTypeValidator,
	deleteClientTypeValidator,
	putClientTypeValidator,
} = require('../validations/clientType-validator');

const router = Router();

/**
 * {{url}}/api/client_types
 */

router.get('/', getClientTypes);

router.get('/:id', getClientTypeValidator, getClientType);

router.post('/', postClientTypeValidator, postClientType);

router.put('/:id', putClientTypeValidator, putClientType);

router.delete('/:id', deleteClientTypeValidator, deleteClientType);

module.exports = router;

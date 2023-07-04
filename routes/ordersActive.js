const { Router } = require('express');

const {
	postOrderValidator,
	getOrderValidator,
	putOrderValidator,
	deleteOrderValidator,
} = require('../validations/order-validator');
const {
	getOrdersActives,
	getOrderActive,
	postOrderActive,
	putOrderActive,
	deleteOrderActive,
} = require('../controllers/ordersActive');

const router = Router();

// /api/orders?limit=20&init=10

router.get('/', getOrdersActives);

router.get('/:id', getOrderValidator, getOrderActive);

router.post('/', postOrderValidator, postOrderActive);

router.put('/:id', putOrderValidator, putOrderActive);

router.delete('/:id', deleteOrderValidator, deleteOrderActive);

module.exports = router;

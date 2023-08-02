const { Router } = require('express');
const {
	getOrders,
	postOrder,
	putOrder,
	deleteOrder,
	getOrder,
	getUserOrder,
	getClientOrder,
	getOrdersToday,
	getOrdersActives,
	getOrdersByDay,
	getOrdersPaginate,
	getClientOrderDebt,
	getOrdersCashier,
} = require('../controllers/orders');
const {
	postOrderValidator,
	getOrderValidator,
	putOrderValidator,
	deleteOrderValidator,
	getOrderUserValidator,
	getOrderClientValidator,
	postOrderLocalValidator,
} = require('../validations/order-validator');

const router = Router();

// /api/orders?limit=20&init=10

router.get('/', getOrders);
router.get('/paginate', getOrdersPaginate);
router.get('/today', getOrdersToday);
router.get('/active', getOrdersActives);
router.get('/cashier', getOrdersCashier);
router.get('/days/:days', getOrdersByDay);

router.get('/:id', getOrderValidator, getOrder);
router.get('/user/:id', getOrderUserValidator, getUserOrder);
router.get('/client/:id', getOrderClientValidator, getClientOrder);
router.get('/clientDebt/:id', getOrderClientValidator, getClientOrderDebt);

router.post('/', postOrderValidator, postOrder);
router.post('/local', postOrderLocalValidator, postOrder);

router.put('/:id', putOrderValidator, putOrder);

router.delete('/:id', deleteOrderValidator, deleteOrder);

module.exports = router;

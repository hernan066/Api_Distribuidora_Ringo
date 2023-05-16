const { Router } = require('express');
const {
	getDeliveryTrucks,
	getDeliveryTruck,
	putDeliveryTruck,
	deleteDeliveryTruck,
	postDeliveryTruck,
	getUserDeliveryTruck,
} = require('../controllers/deliveryTruck');
const {
	getDeliveryTruckValidator,
	postDeliveryTruckValidator,
	putDeliveryTruckValidator,
	deleteDeliveryTruckValidator,
	getUserDeliveryTruckValidator,
} = require('../validations/deliveryTruck-validator');

const router = Router();

/**
 * {{url}}/api/delivery_trucks
 */

router.get('/', getDeliveryTrucks);

router.get('/:id', getDeliveryTruckValidator, getDeliveryTruck);
router.get('/user/:id', getUserDeliveryTruckValidator, getUserDeliveryTruck);

router.post('/', postDeliveryTruckValidator, postDeliveryTruck);

router.put('/:id', putDeliveryTruckValidator, putDeliveryTruck);

router.delete('/:id', deleteDeliveryTruckValidator, deleteDeliveryTruck);

module.exports = router;

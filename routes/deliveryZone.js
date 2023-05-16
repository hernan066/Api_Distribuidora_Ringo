const { Router } = require('express');
const {
	getDeliveryZones,
	getDeliveryZone,
	putDeliveryZone,
	deleteDeliveryZone,
	postDeliveryZone,
} = require('../controllers/deliveryZone');
const {
	getDeliveryZoneValidator,
	postDeliveryZoneValidator,
	putDeliveryZoneValidator,
	deleteDeliveryZoneValidator,
} = require('../validations/deliveryZone-validator');

const router = Router();

/**
 * {{url}}/api/deliveryZones
 */

//  Obtener todas las Zonas - publico
router.get('/', getDeliveryZones);

// Obtener una zona por id - publico
router.get('/:id', getDeliveryZoneValidator, getDeliveryZone);

// Crear zona - privado - cualquier persona con un token válido
router.post('/', postDeliveryZoneValidator, postDeliveryZone);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', putDeliveryZoneValidator, putDeliveryZone);

// Borrar una zona - Admin
router.delete('/:id', deleteDeliveryZoneValidator, deleteDeliveryZone);

module.exports = router;

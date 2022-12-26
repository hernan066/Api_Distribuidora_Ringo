const { Router } = require('express');
const { getDeliverySubZones, getDeliverySubZone, putDeliverySubZone, deleteDeliverySubZone, postDeliverySubZone } = require('../controllers/deliverySubZone');
const { getDeliverySubZoneValidator, postDeliverySubZoneValidator, putDeliverySubZoneValidator, deleteDeliverySubZoneValidator } = require('../validations/deliverySubZone-validator');


const router = Router();

/**
 * {{url}}/api/delivery_sub_zones
 */

//  Obtener todas las SubZonas - publico
router.get('/', getDeliverySubZones );

// Obtener una Subzona por id - publico
router.get('/:id', getDeliverySubZoneValidator , getDeliverySubZone );

// Crear Subzona - privado - cualquier persona con un token válido
router.post('/', postDeliverySubZoneValidator , postDeliverySubZone );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putDeliverySubZoneValidator, putDeliverySubZone );

// Borrar una Subzona - Admin
router.delete('/:id', deleteDeliverySubZoneValidator ,deleteDeliverySubZone);



module.exports = router;
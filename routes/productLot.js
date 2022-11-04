const { Router } = require('express');
const { getProductLots, getProductLot, putProductLot, deleteProductLot, postProductLot } = require('../controllers/productLot');
const { getProductLotValidator, postProductLotValidator, putProductLotValidator, deleteProductLotValidator } = require('../validations/productLot-validator');


const router = Router();

/**
 * {{url}}/api/productLots
 */

//  Obtener todas las Lote de productos - publico
router.get('/', getProductLots );

// Obtener una Lote de productos por id - publico
router.get('/:id', getProductLotValidator , getProductLot );

// Crear Lote de productos - privado - cualquier persona con un token válido
router.post('/', postProductLotValidator , postProductLot );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putProductLotValidator, putProductLot );

// Borrar una Lote de productos - Admin
router.delete('/:id', deleteProductLotValidator ,deleteProductLot);



module.exports = router;
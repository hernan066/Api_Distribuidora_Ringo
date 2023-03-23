const { Router } = require('express');
const {  getOfert, putOfert, deleteOfert, postOfert, getOferts, getOfertByProductId } = require('../controllers/ofert');

const { getOfertValidator, postOfertValidator, deleteOfertValidator, putOfertValidator } = require('../validations/ofert-validator');

const router = Router();

/**
 * {{url}}/api/oferts
 */

//  Obtener todas las marcas - publico
router.get('/', getOferts );

// Obtener una marca por id - publico
router.get('/:id', getOfertValidator , getOfert );
router.get('/product/:id', getOfertValidator , getOfertByProductId );

// Crear marca - privado - cualquier persona con un token válido
router.post('/', postOfertValidator , postOfert );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putOfertValidator, putOfert );

// Borrar una marca - Admin
router.delete('/:id', deleteOfertValidator ,deleteOfert);



module.exports = router;
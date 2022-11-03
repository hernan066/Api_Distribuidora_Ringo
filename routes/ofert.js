const { Router } = require('express');
const {  getOfert, putOfert, deleteOfert, postOfert, getOferts } = require('../controllers/Ofert');

const { getOfertValidation, postOfertValidation, deleteOfertValidation, putOfertValidation } = require('../validations/Ofert-validator');

const router = Router();

/**
 * {{url}}/api/oferts
 */

//  Obtener todas las marcas - publico
router.get('/', getOferts );

// Obtener una marca por id - publico
router.get('/:id', getOfertValidation , getOfert );

// Crear marca - privado - cualquier persona con un token válido
router.post('/', postOfertValidation , postOfert );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putOfertValidation, putOfert );

// Borrar una marca - Admin
router.delete('/:id', deleteOfertValidation ,deleteOfert);



module.exports = router;
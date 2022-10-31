const { Router } = require('express');
const {  getBrand, putBrand, deleteBrand, postBrand, getBrands } = require('../controllers/brand');

const { getBrandValidation, postBrandValidation, deleteBrandValidation, putBrandValidation } = require('../validations/brand-validator');

const router = Router();

/**
 * {{url}}/api/Brans
 */

//  Obtener todas las marcas - publico
router.get('/', getBrands );

// Obtener una marca por id - publico
router.get('/:id', getBrandValidation , getBrand );

// Crear marca - privado - cualquier persona con un token válido
router.post('/', postBrandValidation , postBrand );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putBrandValidation, putBrand );

// Borrar una marca - Admin
router.delete('/:id', deleteBrandValidation ,deleteBrand);



module.exports = router;
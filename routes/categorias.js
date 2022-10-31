const { Router } = require('express');
const { getCategories, getCategory, putCategory, deleteCategory, postCategory } = require('../controllers/categorias');




const { getCategoryValidation, postCategoryValidation, deleteCategoryValidation, putCategoryValidation } = require('../validations/category-validator');

const router = Router();

/**
 * {{url}}/api/categories
 */

//  Obtener todas las categorías - publico
router.get('/', getCategories );

// Obtener una categoría por id - publico
router.get('/:id', getCategoryValidation , getCategory );

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', postCategoryValidation , postCategory );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putCategoryValidation, putCategory );

// Borrar una categoría - Admin
router.delete('/:id', deleteCategoryValidation ,deleteCategory);



module.exports = router;
const { Router } = require('express');
const {
	getClientCategories,
	getClientCategory,
	putClientCategory,
	deleteClientCategory,
	postClientCategory,
} = require('../controllers/clientCategory');

const {
	getClientCategoryValidator,
	postClientCategoryValidator,
	deleteClientCategoryValidator,
	putClientCategoryValidator,
} = require('../validations/clientCategory-validator');

const router = Router();

/**
 * {{url}}/api/client_categories
 */

//  Obtener todas las categorías - publico
router.get('/', getClientCategories);

// Obtener una categoría por id - publico
router.get('/:id', getClientCategoryValidator, getClientCategory);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', postClientCategoryValidator, postClientCategory);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', putClientCategoryValidator, putClientCategory);

// Borrar una categoría - Admin
router.delete('/:id', deleteClientCategoryValidator, deleteClientCategory);

module.exports = router;

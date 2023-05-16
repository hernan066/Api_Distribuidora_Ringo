const { Router } = require('express');
const {
	getSuppliers,
	getSupplier,
	putSupplier,
	deleteSupplier,
	postSupplier,
} = require('../controllers/supplier');
const {
	getSupplierValidator,
	postSupplierValidator,
	putSupplierValidator,
	deleteSupplierValidator,
} = require('../validations/supplier-validator');

const router = Router();

/**
 * {{url}}/api/suppliers
 */

//  Obtener todas las Proveedores - publico
router.get('/', getSuppliers);

// Obtener una Proveedor por id - publico
router.get('/:id', getSupplierValidator, getSupplier);

// Crear Proveedor - privado - cualquier persona con un token válido
router.post('/', postSupplierValidator, postSupplier);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', putSupplierValidator, putSupplier);

// Borrar una Proveedor - Admin
router.delete('/:id', deleteSupplierValidator, deleteSupplier);

module.exports = router;

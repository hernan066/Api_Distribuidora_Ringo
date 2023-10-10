const { Router } = require('express');

const {
	getAllExpenses,
	getExpenses,
	postExpenses,
	putExpenses,
	deleteExpenses,
} = require('../controllers/expenses');
const {
	getExpensesValidation,
	postExpensesValidation,
	putExpensesValidation,
	deleteExpensesValidation,
} = require('../validations/expenses-validator');

const router = Router();

/**
 * {{url}}/api/expenses
 */

//  Obtener todas las gastos - publico
router.get('/', getAllExpenses);

// Obtener una gastos por id - publico
router.get('/:id', getExpensesValidation, getExpenses);

// Crear gastos - privado - cualquier persona con un token válido
router.post('/', postExpensesValidation, postExpenses);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', putExpensesValidation, putExpenses);

// Borrar una gastos - Admin
router.delete('/:id', deleteExpensesValidation, deleteExpenses);

module.exports = router;

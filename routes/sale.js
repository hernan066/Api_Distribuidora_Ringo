const { Router } = require('express');
const {
	getSales,
	getSale,
	putSale,
	deleteSale,
	postSale,
} = require('../controllers/sale');
const {
	getSaleValidator,
	postSaleValidator,
	putSaleValidator,
	deleteSaleValidator,
} = require('../validations/sale-validator');

const router = Router();

/**
 * {{url}}/api/sales
 */

router.get('/', getSales);

router.get('/:id', getSaleValidator, getSale);

router.post('/', postSaleValidator, postSale);

router.put('/:id', putSaleValidator, putSale);

router.delete('/:id', deleteSaleValidator, deleteSale);

module.exports = router;

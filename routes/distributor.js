const { Router } = require('express');
const {
	getDistributors,
	getDistributor,
	putDistributor,
	deleteDistributor,
	postDistributor,
} = require('../controllers/distributor');
const {
	getDistributorValidator,
	postDistributorValidator,
	putDistributorValidator,
	deleteDistributorValidator,
} = require('../validations/distributor-validator');

const router = Router();

/**
 * {{url}}/api/distributors
 */

router.get('/', getDistributors);

router.get('/:id', getDistributorValidator, getDistributor);

router.post('/', postDistributorValidator, postDistributor);

router.put('/:id', putDistributorValidator, putDistributor);

router.delete('/:id', deleteDistributorValidator, deleteDistributor);

module.exports = router;

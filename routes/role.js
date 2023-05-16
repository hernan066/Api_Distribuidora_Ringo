const { Router } = require('express');
const {
	getRoles,
	getRole,
	putRole,
	deleteRole,
	postRole,
} = require('../controllers/role');

const {
	getRoleValidation,
	postRoleValidation,
	deleteRoleValidation,
	putRoleValidation,
	getRolesValidation,
} = require('../validations/role-validator');

const router = Router();

/**
 * {{url}}/api/roles
 */

router.get('/', getRolesValidation, getRoles);

router.get('/:id', getRoleValidation, getRole);

router.post('/', postRoleValidation, postRole);

router.put('/:id', putRoleValidation, putRole);

router.delete('/:id', deleteRoleValidation, deleteRole);

module.exports = router;

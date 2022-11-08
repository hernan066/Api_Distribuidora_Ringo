const { Router } = require('express');
const { getRoles, getRole, putRole, deleteRole, postRole } = require('../controllers/role');




const { getRoleValidation, postRoleValidation, deleteRoleValidation, putRoleValidation } = require('../validations/role-validator');

const router = Router();

/**
 * {{url}}/api/roles
 */

//  Obtener todas las roles - publico
router.get('/', getRoles );

// Obtener una rol por id - publico
router.get('/:id', getRoleValidation , getRole );

// Crear rol - privado - cualquier persona con un token válido
router.post('/', postRoleValidation , postRole );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',putRoleValidation, putRole );

// Borrar una rol - Admin
router.delete('/:id', deleteRoleValidation ,deleteRole);



module.exports = router;
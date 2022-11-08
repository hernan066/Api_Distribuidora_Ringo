const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controllers/user');
const { validarJWT } = require('../middlewares');
const { getUserValidations, postUserValidations, putUserValidations, deleteUserValidations } = require('../validations/user-validator');


const router = Router();


router.get('/',validarJWT, getUsers );
router.get('/:id',getUserValidations, getUser );
router.post('/',postUserValidations, postUser );
router.put('/:id',putUserValidations, putUser );
router.delete('/:id',deleteUserValidations,deleteUser );







module.exports = router;
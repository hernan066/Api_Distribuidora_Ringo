const { Router } = require('express');
const { editUserValidations } = require('../validations/user/editUserValidations');
const { registerUserValidations } = require('../validations/user/registerUserValidations');
const { deleteUserValidations } = require('../validations/user/deleteUserValidations');
const { userGet,userPut,userDelete,userPost} = require('../controllers/user');


const router = Router();


router.get('/', userGet );
router.post('/',registerUserValidations, userPost );
router.put('/:id',editUserValidations, userPut );
router.delete('/:id',deleteUserValidations,userDelete );







module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validar-campos');
const { login, googleSignin, loginRepartidor } = require('../controllers/auth');
const { loginValidator } = require('../validations/auth/loginValidator');


const router = Router();

router.post('/login',loginValidator,login );
router.post('/login_repartidor',[
    check('patente', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
],loginRepartidor );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignin );



module.exports = router;
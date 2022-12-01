const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validar-campos');
const { login, googleSignin, loginRepartidor, loginAdmin, getRevalidateToken, login2, refresh, logout2 } = require('../controllers/auth');
const { loginValidator } = require('../validations/auth/loginValidator');
const { validarJWT } = require('../middlewares');


const router = Router();

router.post('/login',loginValidator,login );
router.post('/admin/login',loginValidator,loginAdmin );

router.get('/revalidate_token',validarJWT ,getRevalidateToken );



router.post('/login_repartidor',[
    check('patente', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
],loginRepartidor );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignin );


//nuevo sistema de login para el dashboard
router.post('/login2',loginValidator,login2 );
router.get('/refresh',refresh );
router.get('/logout2',logout2 );

module.exports = router;
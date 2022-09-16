const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');


const { login, googleSignin, loginRepartidor } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );
router.post('/login_repartidor',[
    check('patente', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],loginRepartidor );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );



module.exports = router;
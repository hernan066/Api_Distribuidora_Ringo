const { Router } = require('express');

const {
	googleSignin,
	loginAdmin,
	refresh,
	logout,
	loginUser,
	loginDeliveryTruck,
	loginDeliveryApp,
} = require('../controllers/auth');
const { loginValidator } = require('../validations/auth/loginValidator');

const router = Router();

router.post('/login', loginValidator, loginUser);

router.post('/login-delivery', loginValidator, loginDeliveryTruck);
router.post('/login-delivery-app', loginValidator, loginDeliveryApp);

router.post('/google', googleSignin);

// nuevo sistema de login para el dashboard
router.post('/login2', loginValidator, loginAdmin);
router.get('/refresh', refresh);
router.get('/logout2', logout);

module.exports = router;

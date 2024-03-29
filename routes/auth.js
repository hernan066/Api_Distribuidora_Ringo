const { Router } = require('express');

const {
	googleSignin,
	loginAdmin,
	refresh,
	logout,
	loginUser,
	loginDeliveryTruck,

	loginCashierSeller,
} = require('../controllers/auth');
const { loginValidator } = require('../validations/auth/loginValidator');

const router = Router();

router.post('/login', loginValidator, loginUser);
router.post('/login_cashier_seller', loginValidator, loginCashierSeller);

// repartidor
router.post('/login-delivery', loginValidator, loginDeliveryTruck);

router.post('/google', googleSignin);

// nuevo sistema de login para el dashboard
router.post('/login2', loginValidator, loginAdmin);
router.get('/refresh', refresh);
router.get('/logout2', logout);

module.exports = router;

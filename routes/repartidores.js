const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const {
	esRoleValido,

	existeRepartidorPorId,
	patenteExiste,
} = require('../helpers/db-validators');

const {
	repartidoresGet,
	repartidoresPut,
	repartidoresPost,
} = require('../controllers/repartidores');

const router = Router();

router.get('/', repartidoresGet);

router.put(
	'/:id',
	[
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existeRepartidorPorId),
		validateFields,
	],
	repartidoresPut
);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password debe de ser más de 6 letras').isLength({
			min: 6,
		}),
		check('patente', 'La patente es obligatoria').not().isEmpty(),
		check('patente').custom(patenteExiste),
		// check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
		check('rol').custom(esRoleValido),
		validateFields,
	],
	repartidoresPost
);

module.exports = router;

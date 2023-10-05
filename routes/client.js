const { Router } = require('express');
const {
	getClients,
	getClient,
	putClient,
	deleteClient,
	postClient,
	getUserClient,
	getAddressesClient,
	postSimpleClient,
	deleteSimpleClient,
} = require('../controllers/client');
const {
	getClientValidator,
	postClientValidator,
	putClientValidator,
	deleteClientValidator,
	getClientUserValidator,
} = require('../validations/client-validator');

const router = Router();

/**
 * {{url}}/api/clients
 */

//  Obtener todas las Clientes - publico
router.get('/', getClients);
// cambiar los clientes a activos si compraron en los ultimos 30 dias
// router.get('/setActiveClients', activeClient)

// Obtener una Cliente por id - publico
router.get('/:id', getClientValidator, getClient);

router.get('/user/:id', getClientUserValidator, getUserClient);

router.get('/addresses/:id', getClientValidator, getAddressesClient);

// Crear Cliente - privado - cualquier persona con un token válido
router.post('/', postClientValidator, postClient);

// Crear Usuario/Cliente/Dirección
router.post('/simpleClient', postSimpleClient);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', putClientValidator, putClient);

// Borrar Usuario/Cliente/Dirección
router.delete('/simpleClient/:id', deleteClientValidator, deleteSimpleClient);

// Borrar una Cliente - Admin
router.delete('/:id', deleteClientValidator, deleteClient);

module.exports = router;

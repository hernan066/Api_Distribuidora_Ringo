const { response } = require('express');

const isAdminRole = async (req, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: 'Se quiere verificar el role sin validar el token primero',
		});
	}

	const role = req.role;

	// const userRole = await Role.findById(role);

	if (role !== process.env.ADMIN_ROLE) {
		return res.status(401).json({
			msg: `No es administrador - No puede hacer esto - ${role}`,
		});
	}

	next();
};

const tieneRole = (...roles) => {
	return (req, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: 'Se quiere verificar el role sin validar el token primero',
			});
		}

		if (!roles.includes(req.user.rol)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}`,
			});
		}

		next();
	};
};

module.exports = {
	isAdminRole,
	tieneRole,
};

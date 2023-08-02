/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { User, Role, Client, DeliveryTruck } = require('../models');
const jwt = require('jsonwebtoken');

const loginCashierSeller = async (req, res) => {
	const cookies = req.cookies;
	const roles = ['ADMIN_ROLE', 'CASHIER_ROLE', 'SELLER_ROLE'];
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ msg: 'Email o password no son correctos' });

		// Verificar si el email existe
		let role;
		const foundUser = await User.findOne({ email }).exec();

		if (foundUser) {
			role = await Role.findById(foundUser.role);
		} else {
			return res.status(401).json({
				msg: 'Email o password no son correctos',
			});
		}
		// SI el user está activo
		if (!foundUser.state) {
			return res.status(401).json({
				ok: false,
				status: 401,
				msg: 'Email o password no son correctos',
			});
		}
		// Si su rol es correcto
		if (!roles.includes(role.role)) {
			return res.status(403).json({
				ok: false,
				status: 403,
				msg: 'Esta cuenta no tiene permisos de acceso',
			});
		}

		// Verificar la contraseña
		const validPassword = await bcryptjs.compare(password, foundUser.password);

		if (validPassword) {
			// create JWTs
			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_SECRET,
				{ expiresIn: '15m' }
			);
			const newRefreshToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_REFRESH,
				{ expiresIn: '1d' }
			);

			// Changed to let keyword
			let newRefreshTokenArray = !cookies?.jwt
				? foundUser.refreshToken
				: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

			if (cookies?.jwt) {
				/* Posibles escenarios:
                1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
                2) RT es robado
                3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
				const refreshToken = cookies.jwt;
				const foundToken = await User.findOne({ refreshToken }).exec();

				// Se detecta rt reutilizado!
				if (!foundToken) {
					// se limpian todos los anteriores refresh tokens
					newRefreshTokenArray = [];
				}

				res.clearCookie('jwt', {
					httpOnly: true,
					sameSite: 'None',
					secure: true,
				});
			}

			// Se guarda el refreshToken en el usuario actual
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			// Se crea una Cookie segura con el refresh token
			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});

			// Se envía el id del usuario y el rol en el token
			return res.status(201).json({
				ok: true,
				status: 201,
				accessToken,
				user: {
					id: foundUser._id,
					name: foundUser.name,
					lastName: foundUser.lastName,
					email: foundUser.email,
					phone: foundUser.phone,
				},
			});
		} else {
			return res.status(401).json({
				ok: false,
				status: 401,
				msg: 'Email o password no son correctos',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const loginUser = async (req, res = response) => {
	const cookies = req.cookies;

	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ msg: 'Email o password no son correctos' });

	// Verificar si el email existe
	let role;
	let client;
	const foundUser = await User.findOne({ email }).exec();

	if (foundUser) {
		role = await Role.findById(foundUser.role);
		client = await Client.findOne({ user: foundUser._id }).populate(
			'clientType',
			['clientType']
		);
	} else {
		return res.status(401).json({
			msg: 'Email o password no son correctos',
		});
	}
	// SI el user está activo
	if (!foundUser.state) {
		return res.status(401).json({
			ok: false,
			status: 401,
			msg: 'Email o password no son correctos',
		});
	}
	// si verifico su correo
	if (!foundUser.verified) {
		return res.status(401).json({
			ok: false,
			status: 401,
			msg: 'Email no verificado, revise su correo para verificar',
		});
	}

	// Verificar la contraseña
	const validPassword = await bcryptjs.compare(password, foundUser.password);

	if (validPassword) {
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					id: foundUser._id,
					role: role.role,
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: '15m' }
		);
		const newRefreshToken = jwt.sign(
			{ id: foundUser._id },
			process.env.JWT_REFRESH,
			{ expiresIn: '1d' }
		);

		// Changed to let keyword
		let newRefreshTokenArray = !cookies?.jwt
			? foundUser.refreshToken
			: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

		if (cookies?.jwt) {
			/* Posibles escenarios:
                1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
                2) RT es robado
                3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
			const refreshToken = cookies.jwt;
			const foundToken = await User.findOne({ refreshToken }).exec();

			// Se detecta rt reutilizado!
			if (!foundToken) {
				// se limpian todos los anteriores refresh tokens
				newRefreshTokenArray = [];
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
		}

		// Se guarda el refreshToken en el usuario actual
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		// Se crea una Cookie segura con el refresh token
		res.cookie('jwt', newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});

		// Se envía el id del usuario y el rol en el token
		res.json({
			accessToken,
			id: foundUser._id,
			clientType: client.clientType.clientType,
		});
	} else {
		return res.status(401).json({
			ok: false,
			status: 401,
			msg: 'Email o password no son correctos',
		});
	}
};

const loginDeliveryTruck = async (req, res) => {
	const cookies = req.cookies;
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ msg: 'Email o password no son correctos' });

		// Verificar si el email existe
		let role;
		const foundUser = await User.findOne({ email }).exec();

		if (foundUser) {
			role = await Role.findById(foundUser.role);
		} else {
			return res.status(401).json({
				msg: 'Email o password no son correctos',
			});
		}
		// SI el user está activo
		if (!foundUser.state) {
			return res.status(401).json({
				ok: false,
				status: 401,
				msg: 'Email o password no son correctos',
			});
		}
		// SI no es repartidor
		if (role.role !== process.env.DELIVERY_ROLE) {
			return res.status(403).json({
				ok: false,
				status: 403,
				msg: 'Esta cuenta no tiene permisos de acceso',
			});
		}

		// Verificar la contraseña
		const validPassword = await bcryptjs.compare(password, foundUser.password);

		if (validPassword) {
			// create JWTs
			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_SECRET,
				{ expiresIn: '120m' }
			);
			const newRefreshToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_REFRESH,
				{ expiresIn: '1d' }
			);

			// Changed to let keyword
			let newRefreshTokenArray = !cookies?.jwt
				? foundUser.refreshToken
				: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

			if (cookies?.jwt) {
				/* Posibles escenarios:
                1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
                2) RT es robado
                3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
				const refreshToken = cookies.jwt;
				const foundToken = await User.findOne({ refreshToken }).exec();

				// Se detecta rt reutilizado!
				if (!foundToken) {
					// se limpian todos los anteriores refresh tokens
					newRefreshTokenArray = [];
				}

				res.clearCookie('jwt', {
					httpOnly: true,
					sameSite: 'None',
					secure: true,
				});
			}

			// Se guarda el refreshToken en el usuario actual
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			// Se crea una Cookie segura con el refresh token
			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});
			// Buscar datos del repartidor
			const deliveryTruck = await DeliveryTruck.find({
				user: foundUser._id,
				state: true,
			})
				.populate('distributor')
				.populate('user', ['name', 'lastName', 'phone', 'email'])
				.populate('defaultZone', ['name', 'cost']);

			// Se envía el id del usuario y el rol en el token
			return res.status(201).json({
				ok: true,
				status: 201,
				accessToken,
				id: foundUser._id,
				deliveryTruck: deliveryTruck[0],
			});
		} else {
			return res.status(401).json({
				ok: false,
				status: 401,
				msg: 'Email o password no son correctos',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const googleSignin = async (req, res = response) => {
	const { email, name, lastName, id_social } = req.body;
	const cookies = req.cookies;

	try {
		let foundUser = await User.findOne({ id_social, state: true });

		if (!foundUser) {
			// Tengo que crearlo
			const data = {
				id_social,
				name,
				lastName,
				email,
				password: null,
				phone: null,
				google: true,
				verified: true,
				social_provider: 'google',
				role: '636a6311c2e277ca644463fb',
			};

			foundUser = new User(data);
			await foundUser.save();

			const dataClient = {
				user: foundUser._id,
				clientCategory: '636a8e3e8b0abe9de10c7948',
				clientType: '63b34fef55257d408a217911',
				cuit: null,
				contactMeans: '',
				campaignName: '',
			};

			const newClient = new Client(dataClient);
			await newClient.save();
		}

		// si existe pero no coincide el id_social
		if (foundUser) {
			if (id_social !== foundUser.id_social) {
				return res.status(401).json({
					ok: false,
					status: 401,
					msg: 'Error de credenciales',
				});
			}
		}

		// Si el usuario en DB esta borrado
		if (!foundUser.state) {
			return res.status(401).json({
				msg: 'Hable con el administrador, usuario bloqueado',
			});
		}

		// busco datos del cliente
		const client = await Client.findOne({ user: foundUser._id }).populate(
			'clientType',
			['clientType']
		);

		// creo el token
		const accessToken = jwt.sign(
			{
				UserInfo: {
					id: foundUser._id,
					role: 'USER_ROLE',
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: '15m' }
		);
		const newRefreshToken = jwt.sign(
			{ id: foundUser._id },
			process.env.JWT_REFRESH,
			{ expiresIn: '1d' }
		);

		// Changed to let keyword
		let newRefreshTokenArray = !cookies?.jwt
			? foundUser.refreshToken
			: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

		if (cookies?.jwt) {
			/* Posibles escenarios:
              1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
              2) RT es robado
              3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
			const refreshToken = cookies.jwt;
			const foundToken = await User.findOne({ refreshToken }).exec();

			// Se detecta rt reutilizado!
			if (!foundToken) {
				// se limpian todos los anteriores refresh tokens
				newRefreshTokenArray = [];
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
		}

		// Se guarda el refreshToken en el usuario actual
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		// Se crea una Cookie segura con el refresh token
		res.cookie('jwt', newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});

		// Se envía el id del usuario y el rol en el token
		res.json({
			accessToken,
			id: foundUser._id,
			clientType: client.clientType.clientType,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Error del servidor',
		});
	}
};

//  nuevo sistema de login para el dashboard
const loginAdmin = async (req, res) => {
	const cookies = req.cookies;

	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({ msg: 'Email o password no son correctos' });

	// Verificar si el email existe
	let role;
	const foundUser = await User.findOne({ email }).exec();

	if (foundUser) {
		role = await Role.findById(foundUser.role);
	} else {
		return res.status(401).json({
			msg: 'Email o password no son correctos',
		});
	}
	// SI el user está activo
	if (!foundUser.state) {
		return res.status(401).json({
			ok: false,
			status: 401,
			msg: 'Email o password no son correctos',
		});
	}
	// SI no es admin
	if (role.role !== process.env.ADMIN_ROLE) {
		return res.status(403).json({
			ok: false,
			status: 403,
			msg: 'Esta cuenta no tiene permisos de acceso',
		});
	}

	// Verificar la contraseña
	const validPassword = await bcryptjs.compare(password, foundUser.password);

	if (validPassword) {
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					id: foundUser._id,
					role: role.role,
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: '120m' }
		);
		const newRefreshToken = jwt.sign(
			{
				UserInfo: {
					id: foundUser._id,
					role: role.role,
				},
			},
			process.env.JWT_REFRESH,
			{ expiresIn: '1d' }
		);

		// Changed to let keyword
		let newRefreshTokenArray = !cookies?.jwt
			? foundUser.refreshToken
			: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

		if (cookies?.jwt) {
			/* Posibles escenarios:
                1) El usuario inicia sesión pero nunca usa RT y no cierra la sesión
                2) RT es robado
                3) Si 1 y 2, hay que borrar todos los RT cuando el usuario inicia sesión */
			const refreshToken = cookies.jwt;
			const foundToken = await User.findOne({ refreshToken }).exec();

			// Se detecta rt reutilizado!
			if (!foundToken) {
				// se limpian todos los anteriores refresh tokens
				newRefreshTokenArray = [];
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
		}

		// Se guarda el refreshToken en el usuario actual
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		// Se crea una Cookie segura con el refresh token
		res.cookie('jwt', newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});

		// Se envía el id del usuario y el rol en el token
		return res.status(200).json({
			accessToken,
			id: foundUser._id,
		});
	} else {
		return res.status(401).json({
			ok: false,
			status: 401,
			msg: 'Email o password no son correctos',
		});
	}
};

const refresh = async (req, res) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.jwt) {
			// console.log('Cookies >>>>>>>>>>>>>>', cookies);
			return res.status(401).json({
				ok: false,
				status: 401,
				msg: 'No autorizado',
			});
		}
		const refreshToken = cookies.jwt;

		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

		const foundUser = await User.findOne({ refreshToken }).exec();

		// Se detecta reutilización de RT
		if (!foundUser) {
			jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
				if (err)
					return res.status(403).json({
						ok: false,
						status: 403,
						msg: err,
						refreshToken,
					}); // Forbidden
				// Delete refresh tokens of hacked user
				const hackedUser = await User.findOne({ _id: decoded.id }).exec();
				hackedUser.refreshToken = [];
				await hackedUser.save();
			});
			return res.status(403).json({
				ok: false,
				status: 403,
				msg: 'Usuario no encontrado',
			}); // Forbidden
		}

		const newRefreshTokenArray = foundUser.refreshToken.filter(
			(rt) => rt !== refreshToken
		);

		// evaluate jwt
		jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, decoded) => {
			if (err) {
				// expired refresh token
				foundUser.refreshToken = [...newRefreshTokenArray];
				await foundUser.save();
			}
			if (err || foundUser._id.toString() !== decoded.UserInfo.id)
				return res.status(403).json({
					ok: false,
					status: 403,
					msg: 'Error de token',
					err,
				}); // Forbidden);

			// Refresh token was still valid
			// const roles = Object.values(foundUser.roles);
			const role = await Role.findById(foundUser.role);

			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_SECRET,
				{ expiresIn: '1d' }
			);

			const newRefreshToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						role: role.role,
					},
				},
				process.env.JWT_REFRESH,
				{ expiresIn: '1d' }
			);
			// Saving refreshToken with current user
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			const client = await Client.findOne({ user: foundUser?._id }).populate(
				'clientType',
				['clientType']
			);

			// Creates Secure Cookie with refresh token
			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});

			return res.status(200).json({
				accessToken,
				id: foundUser._id,
				clientType: client?.clientType?.clientType,
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const logout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}

	// Delete refreshToken in db
	foundUser.refreshToken = foundUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	);
	const result = await foundUser.save();
	console.log(result);

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
};

module.exports = {
	loginCashierSeller,
	loginUser,
	loginDeliveryTruck,
	googleSignin,
	loginAdmin,
	refresh,
	logout,
};

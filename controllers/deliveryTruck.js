const { response } = require('express');
const { DeliveryTruck, User } = require('../models');
const bcryptjs = require('bcryptjs');

const getDeliveryTrucks = async (req, res = response) => {
	try {
		const { limit = 1000, from = 0 } = req.query;
		const query = { state: true };

		const [total, deliveryTrucks] = await Promise.all([
			DeliveryTruck.countDocuments(query),
			DeliveryTruck.find(query)
				.populate('distributor')
				.populate('user')
				.populate('defaultZone')
				.skip(Number(from))
				.limit(Number(limit)),
		]);

		res.status(200).json({
			ok: true,
			status: 200,
			total,
			data: {
				deliveryTrucks,
			},
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const getDeliveryTruck = async (req, res = response) => {
	try {
		const { id } = req.params;
		const deliveryTruck = await DeliveryTruck.findById(id)
			.populate('user', ['name', 'lastName', 'phone', 'email'])
			.populate('distributor');

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryTruck,
			},
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};
const getUserDeliveryTruck = async (req, res = response) => {
	try {
		const { id } = req.params;
		const deliveryTruck = await DeliveryTruck.find({ user: id, state: true })
			.populate('distributor')
			.populate('user', ['name', 'lastName', 'phone', 'email'])
			.populate('defaultZone', ['name', 'cost']);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryTruck,
			},
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const postDeliveryTruck = async (req, res = response) => {
	try {
		const {
			name,
			lastName,
			password,
			email,
			phone,
			dni,
			truckId,
			patent,
			coldChamber,
			maximumLoad,
		} = req.body;

		const existPhone = await User.findOne({ phone });
		if (existPhone && existPhone[0]) {
			return res.status(400).json({
				ok: false,
				status: 400,
				msg: `El teléfono ${phone} ya esta registrado`,
			});
		}
		const existEmail = await User.findOne({ email });
		if (existEmail && existEmail[0]) {
			return res.status(400).json({
				ok: false,
				status: 400,
				msg: `El email ${email} ya esta registrado`,
			});
		}
		const existDni = await User.findOne({ dni });
		if (existDni && existDni[0]) {
			return res.status(400).json({
				ok: false,
				status: 400,
				msg: `El DNI/CUIL ${dni} ya esta registrado`,
			});
		}
		const existPatent = await DeliveryTruck.findOne({ patent });
		if (existPatent && existPatent[0]) {
			return res.status(400).json({
				ok: false,
				status: 400,
				msg: `La patente ${patent} ya esta registrada`,
			});
		}

		// 1- primero creo el usuario
		const salt = bcryptjs.genSaltSync();
		const newPassword = bcryptjs.hashSync(password, salt);

		const user = new User({
			role: '63a30cc3f73f4b70d25a8678',
			name,
			lastName,
			password: newPassword,
			phone,
			email,
			verified: true,
		});

		// Guardar en BD
		await user.save();

		// 2- segundo creo el cliente
		const delivery = new DeliveryTruck({
			user: user._id,
			truckId,
			patent,
			coldChamber,
			maximumLoad,
		});

		// Guardar DB
		await delivery.save();

		return res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryTruck: {
					user: user._id,
					name,
					lastName,
					phone,
					email,
					truckId,
					patent,
					coldChamber,
					maximumLoad,
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const putDeliveryTruck = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { state, ...data } = req.body;

		const deliveryTruck = await DeliveryTruck.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryTruck,
			},
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const deleteDeliveryTruck = async (req, res = response) => {
	try {
		const { id } = req.params;
		await DeliveryTruck.findByIdAndUpdate(id, { state: false }, { new: true });

		res.status(200).json({
			ok: true,
			status: 200,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

module.exports = {
	postDeliveryTruck,
	getDeliveryTrucks,
	getDeliveryTruck,
	putDeliveryTruck,
	deleteDeliveryTruck,
	getUserDeliveryTruck,
};

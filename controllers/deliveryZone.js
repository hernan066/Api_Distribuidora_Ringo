const { response } = require('express');
const { DeliveryZone } = require('../models');

const getDeliveryZones = async (req, res = response) => {
	try {
		const { limit = 1000, from = 0 } = req.query;
		const query = { state: true };

		const [total, deliveryZones] = await Promise.all([
			DeliveryZone.countDocuments(query),
			DeliveryZone.find(query).skip(Number(from)).limit(Number(limit)),
		]);

		const order = deliveryZones.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});

		res.status(200).json({
			ok: true,
			status: 200,
			total,
			data: {
				deliveryZones: order,
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

const getDeliveryZone = async (req, res = response) => {
	try {
		const { id } = req.params;
		const deliveryZone = await DeliveryZone.findById(id);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryZone,
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

const postDeliveryZone = async (req, res = response) => {
	try {
		const { state, ...body } = req.body;

		const deliveryZoneDB = await DeliveryZone.findOne({ name: body.name });

		if (deliveryZoneDB) {
			return res.status(400).json({
				msg: `La zona ${deliveryZoneDB.name}, ya existe`,
			});
		}

		// Generar la data a guardar
		const data = {
			...body,
		};

		const deliveryZone = new DeliveryZone(data);

		// Guardar DB
		await deliveryZone.save();

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryZone,
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

const putDeliveryZone = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { state, ...data } = req.body;

		const deliveryZone = await DeliveryZone.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				deliveryZone,
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

const deleteDeliveryZone = async (req, res = response) => {
	try {
		const { id } = req.params;
		await DeliveryZone.findByIdAndUpdate(id, { state: false }, { new: true });

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
	postDeliveryZone,
	getDeliveryZones,
	getDeliveryZone,
	putDeliveryZone,
	deleteDeliveryZone,
};

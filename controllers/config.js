const { response } = require('express');
const { Config, Order, Client } = require('../models');

const getConfig = async (req, res = response) => {
	try {
		const config = await Config.find({ state: true });

		return res.status(200).json({
			ok: true,
			status: 200,
			config: config[0],
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const putConfig = async (req, res = response) => {
	try {
		const { inactiveDays } = req.body;

		const data = {
			inactiveDays,
		};

		const editConfig = await Config.findByIdAndUpdate(
			'650094ef155817eb4ab49020',
			data,
			{ new: true }
		);

		return res.status(200).json({
			ok: true,
			status: 200,
			config: editConfig,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};
const setConfigActiveClient = async (req, res = response) => {
	try {
		const config = await Config.findById('650094ef155817eb4ab49020');
		const lastOrders = await Order.aggregate([
			{
				$match: {
					state: true,
					deliveryDate: {
						$gte: new Date(
							new Date().setDate(new Date().getDate() - config.inactiveDays)
						),
					},
				},
			},
			{
				$project: {
					client: 1,
					deliveryDate: 1,
				},
			},
		]);

		await Client.updateMany({}, { $set: { active: false } });

		lastOrders.forEach(async (order) => {
			await Client.findByIdAndUpdate(order.client, { active: true });
		});

		return res.status(200).json({
			ok: true,
			status: 200,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

module.exports = {
	getConfig,
	putConfig,
	setConfigActiveClient,
};

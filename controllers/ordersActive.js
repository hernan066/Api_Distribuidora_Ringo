const { response } = require('express');
const { OrderActive } = require('../models');

const getOrdersActives = async (req, res = response) => {
	try {
		const { limit = 10000000, from = 0, active, delivery = '' } = req.query;
		const query = { state: true };

		const [total, orders] = await Promise.all([
			OrderActive.countDocuments(query),
			OrderActive.find(query)
				.skip(Number(from))
				.limit(Number(limit))
				.populate('deliveryTruck')
				.populate('employee')
				.populate('deliveryZone')
				.sort({ createdAt: -1 }),
		]);

		if (delivery && delivery !== '' && active === 'true') {
			const ordersActives = await OrderActive.find({
				active: true,
				deliveryTruck: delivery,
				state: true,
			})
				.populate('deliveryTruck')
				.populate('employee')
				.populate('deliveryZone');

			return res.status(200).json({
				ok: true,
				status: 200,
				total: ordersActives.length,
				data: {
					orders: ordersActives,
				},
			});
		}

		res.status(200).json({
			ok: true,
			status: 200,
			total,
			data: {
				orders,
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
const getOrderActive = async (req, res = response) => {
	try {
		const { id } = req.params;
		const order = await OrderActive.findById(id)
			.populate('deliveryTruck')
			.populate('employee')
			.populate('deliveryZone');

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				order,
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

const postOrderActive = async (req, res = response) => {
	try {
		const { state, paid, subTotal, client, ...body } = req.body;

		const data = {
			paid,
			subTotal,
			client,
			...body,
		};

		const order = new OrderActive(data);

		// Guardar DB
		await order.save();

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				order,
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

const putOrderActive = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { state, ...data } = req.body;

		const order = await OrderActive.findByIdAndUpdate(id, data);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				order,
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

const deleteOrderActive = async (req, res = response) => {
	try {
		const { id } = req.params;
		await OrderActive.findByIdAndUpdate(id, { state: false }, { new: true });

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
	getOrdersActives,
	getOrderActive,
	postOrderActive,
	putOrderActive,
	deleteOrderActive,
};

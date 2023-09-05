const { response } = require('express');
const { Order } = require('../../models');
const { ObjectId } = require('mongoose').Types;

// ordenes
const deliveryOrders = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { from, to } = req.body; // "Tue, 21 Mar 2023 00:00:00 GMT"

		const report = await Order.aggregate([
			{
				$match: {
					state: true,
					deliveryTruck: new ObjectId(id),
					deliveryDate: {
						$gt: new Date(from),
						$lt: new Date(to),
					},
				},
			},
		]);

		return res.status(200).json({
			ok: true,
			status: 200,
			from,
			to,
			data: {
				report,
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
const individualDeliveryReport = async (req, res = response) => {};

module.exports = {
	deliveryOrders,
	individualDeliveryReport,
};

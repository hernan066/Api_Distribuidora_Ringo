const { Order } = require('../models');

const saveOrder = async (payload) => {
	try {
		const order = new Order(payload);
		await order.save();

		return {
			ok: true,
			order,
		};
	} catch (error) {
		return {
			ok: false,
			error,
		};
	}
};

module.exports = {
	saveOrder,
};

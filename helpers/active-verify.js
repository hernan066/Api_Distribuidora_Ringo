const { Order, Client } = require('../models');

const activeClient = async () => {
	// Verificar si el correo existe
	const lastOrders = await Order.aggregate([
		{
			$match: {
				state: true,
				deliveryDate: {
					$gte: new Date(new Date().setDate(new Date().getDate() - 20)),
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
	console.log('-----------Active Clients Update--------------');
};

module.exports = {
	activeClient,
};

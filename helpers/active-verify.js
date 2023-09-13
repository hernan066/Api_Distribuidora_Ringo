const { Order, Client, Config } = require('../models');

const activeClient = async () => {
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
	console.log('-----------Active Clients Update--------------');
};

module.exports = {
	activeClient,
};

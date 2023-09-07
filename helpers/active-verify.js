const { Order, Client } = require('../models');

const activeClient = async () => {
	// Verificar si el correo existe
	const lastOrders = await Order.aggregate([
		{
			$match: {
				state: true,
				status: 'Entregado',
				deliveryDate: {
					$gt: new Date('Tue, 21 Mar 2023 03:00:00 GMT'),
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'userOrder',
			},
		},
		{
			$lookup: {
				from: 'clients',
				localField: 'client',
				foreignField: '_id',
				as: 'clientOrder',
			},
		},
		{
			$unwind: {
				path: '$orderItems',
			},
		},
		{
			$unwind: {
				path: '$clientOrder',
			},
		},
		{
			$unwind: {
				path: '$userOrder',
			},
		},
		{
			$project: {
				_id: 0,
				deliveryDate: 1,
				client: 1,
				userId: '$userOrder._id',
				clientId: '$client',
				name: '$userOrder.name',
				lastName: '$userOrder.lastName',
				totalBuy: '$orderItems.totalPrice',
				orderItems: 1,
				active: '$clientOrder.active',
				totalCost: {
					$multiply: ['$orderItems.totalQuantity', '$orderItems.unitCost'],
				},
			},
		},
		{
			$project: {
				deliveryDate: 1,
				active: 1,
				client: 1,
				userId: 1,
				name: 1,
				lastName: 1,
				orderItems: 1,
				totalBuy: 1,
				totalCost: 1,
				totalProfits: {
					$subtract: ['$totalBuy', '$totalCost'],
				},
			},
		},
		{
			$group: {
				_id: {
					userId: '$userId',
					clientId: '$client',
					name: '$name',
					lastName: '$lastName',
					active: '$active',
				},
				totalCost: {
					$sum: '$totalCost',
				},
				totalBuy: {
					$sum: '$totalBuy',
				},
				totalProfits: {
					$sum: '$totalProfits',
				},
			},
		},
		{
			$project: {
				_id: 0,
				totalBuy: 1,
				totalCost: 1,
				totalProfits: 1,
				name: '$_id.name',
				lastName: '$_id.lastName',
				userId: '$_id.userId',
				clientId: '$_id.clientId',
				totalProfits: 1,
				active: '$_id.active',
			},
		},
		{
			$sort: {
				totalBuy: -1,
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

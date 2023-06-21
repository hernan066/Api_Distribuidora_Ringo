/* eslint-disable no-unreachable */
const { response } = require('express');
const { Product, Order } = require('../../models');

const getCategoryReport = async (req, res = response) => {
	// tiene 4 búsquedas stock, totalSell, totalBuy, totalSellLocal
	const { category } = req.params;
	const { stock, totalSell, totalBuy, totalSellLocal } = req.query;
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const day = today.getDate();
	const from = new Date(year, month, day, 0, 0, 0, 0);

	try {
		let report = {};
		if (stock === '1') {
			const stock = await Product.aggregate([
				{
					$match: {
						state: true,
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$stock',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
				{
					$project: {
						name: 1,
						img: 1,
						stock: 1,
						actualStock: '$stock.stock',
						category: '$category.name',
					},
				},
				{
					$match: {
						actualStock: {
							$gt: 0,
						},
						category,
					},
				},
				{
					$group: {
						_id: {
							category: '$category',
						},
						actualStock: {
							$sum: '$stock.stock',
						},
					},
				},
				{
					$project: {
						_id: 0,
						category: '$_id.category',
						actualStock: 1,
					},
				},
				{
					$sort: {
						name: 1,
					},
				},
			]);

			report = {
				...report,
				stock: stock[0] || 'No hay resultados',
			};
		}
		if (totalSell === '1') {
			const totalSell = await Order.aggregate([
				{
					$match: {
						state: true,
						status: 'Entregado',
						deliveryDate: {
							$gte: from,
						},
					},
				},
				{
					$unwind: {
						path: '$orderItems',
					},
				},
				{
					$project: {
						deliveryDate: 1,
						orderItems: 1,
						CostTotal: {
							$multiply: ['$orderItems.totalQuantity', '$orderItems.unitCost'],
						},
					},
				},
				{
					$group: {
						_id: {
							id: '$orderItems.productId',
						},
						count: {
							$sum: '$orderItems.totalQuantity',
						},
						total: {
							$sum: '$orderItems.totalPrice',
						},
						totalCost: {
							$sum: '$CostTotal',
						},
					},
				},
				{
					$lookup: {
						from: 'products',
						localField: '_id.id',
						foreignField: '_id',
						as: 'productOrder',
					},
				},
				{
					$unwind: {
						path: '$productOrder',
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'productOrder.category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
				{
					$project: {
						_id: 0,
						productId: '$productOrder._id',
						name: '$productOrder.name',
						img: '$productOrder.img',
						count: 1,
						total: 1,
						totalCost: 1,
						totalProfits: {
							$subtract: ['$total', '$totalCost'],
						},
						category: '$category.name',
					},
				},
				{
					$match: {
						category,
					},
				},
				{
					$group: {
						_id: {
							id: '$category',
						},
						totalQuantitySell: {
							$sum: '$count',
						},
					},
				},
				{
					$project: {
						totalQuantitySell: 1,
						category: '$_id.id',
						_id: 0,
					},
				},
			]);
			report = {
				...report,
				totalSell: totalSell[0] || 'No hay resultados',
			};
		}
		if (totalBuy === '1') {
			const totalBuy = await Product.aggregate([
				{
					$match: {
						state: true,
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$stock',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
				{
					$project: {
						name: 1,
						img: 1,
						stock: 1,
						quantityBuy: '$stock.quantity',
						category: '$category.name',
						createdAt: '$stock.createdStock',
						return: '$stock.return',
					},
				},
				{
					$match: {
						createdAt: {
							$gt: from,
						},
						category,
						return: false,
					},
				},
				{
					$group: {
						_id: {
							category: '$category',
						},
						buyToday: {
							$sum: '$quantityBuy',
						},
					},
				},
				{
					$project: {
						_id: 0,
						category: '$_id.category',
						buyToday: 1,
					},
				},
			]);
			report = {
				...report,
				totalBuy: totalBuy[0],
			};
		}
		if (totalSellLocal === '1') {
			const totalSellLocal = await Order.aggregate([
				{
					$match: {
						state: true,
						status: 'Entregado',
						deliveryDate: {
							$gte: from,
						},
					},
				},
				{
					$project: {
						orderItems: 1,
						shippingAddress: '$shippingAddress.province',
					},
				},
				{
					$match: {
						shippingAddress: 'Buenos Aires',
					},
				},
				{
					$unwind: {
						path: '$orderItems',
					},
				},
				{
					$group: {
						_id: {
							id: '$orderItems.productId',
						},
						count: {
							$sum: '$orderItems.totalQuantity',
						},
					},
				},
				{
					$lookup: {
						from: 'products',
						localField: '_id.id',
						foreignField: '_id',
						as: 'productOrder',
					},
				},
				{
					$unwind: {
						path: '$productOrder',
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'productOrder.category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
				{
					$project: {
						_id: 0,
						productId: '$productOrder._id',
						name: '$productOrder.name',
						count: 1,
						category: '$category.name',
					},
				},
				{
					$match: {
						category,
					},
				},
				{
					$group: {
						_id: {
							id: '$category',
						},
						totalQuantityLocalSell: {
							$sum: '$count',
						},
					},
				},
				{
					$project: {
						totalQuantityLocalSell: 1,
						category: '$_id.id',
						_id: 0,
					},
				},
			]);
			report = {
				...report,
				totalSellLocal: totalSellLocal[0] || 'No hay resultados',
			};
		}
		res.status(200).json({
			ok: true,
			status: 200,
			from,

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
// últimos 30 días
const getCategoryReportByDay = async (req, res = response) => {
	const from = new Date(new Date().setDate(new Date().getDate() - 30));
	const { category } = req.params;

	try {
		const report = await Order.aggregate([
			{
				$match: {
					state: true,
					status: 'Entregado',
					deliveryDate: {
						$gte: from,
					},
				},
			},
			{
				$unwind: {
					path: '$orderItems',
				},
			},
			{
				$project: {
					deliveryDate: 1,
					orderItems: 1,
					deliveryZone: 1,
				},
			},
			{
				$group: {
					_id: {
						productId: '$orderItems.productId',
						deliveryZone: '$deliveryZone',
						day: {
							$dayOfMonth: '$deliveryDate',
						},
						month: {
							$month: '$deliveryDate',
						},
						year: {
							$year: '$deliveryDate',
						},
					},
					count: {
						$sum: '$orderItems.totalQuantity',
					},
				},
			},
			{
				$lookup: {
					from: 'deliveryzones',
					localField: '_id.deliveryZone',
					foreignField: '_id',
					as: 'deliveryZone',
				},
			},
			{
				$lookup: {
					from: 'products',
					localField: '_id.productId',
					foreignField: '_id',
					as: 'productOrder',
				},
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'productOrder.category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{
				$unwind: {
					path: '$productOrder',
				},
			},
			{
				$unwind: {
					path: '$deliveryZone',
				},
			},
			{
				$unwind: {
					path: '$category',
				},
			},
			{
				$project: {
					_id: 0,
					deliveryZone: '$deliveryZone.name',
					category: '$category.name',
					count: 1,
					day: {
						$toString: '$_id.day',
					},
					month: {
						$toString: '$_id.month',
					},
					year: {
						$toString: '$_id.year',
					},
				},
			},
			{
				$project: {
					date: {
						$concat: ['$month', '-', '$day', '-', '$year'],
					},
					count: 1,
					deliveryZone: 1,
					category: 1,
				},
			},
			{
				$match: {
					category,
				},
			},
			{
				$group: {
					_id: {
						deliveryZone: '$deliveryZone',
						category: '$category',
						date: '$date',
					},
					totalQuantitySell: {
						$sum: '$count',
					},
				},
			},
			{
				$project: {
					totalQuantitySell: 1,
					category: '$_id.category',
					deliveryZone: '$_id.deliveryZone',
					date: '$_id.date',
					_id: 0,
				},
			},
		]);

		res.status(200).json({
			ok: true,
			status: 200,
			from,

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
module.exports = {
	getCategoryReport,
	getCategoryReportByDay,
};

const { response } = require('express');
const { Ofert } = require('../models');

const getOferts = async (req, res = response) => {
	try {
		const { limit = 1000, from = 0 } = req.query;
		const query = { state: true };

		const [total, oferts] = await Promise.all([
			Ofert.countDocuments(query),
			Ofert.find(query)
				.skip(Number(from))
				.limit(Number(limit))
				.populate('product', [
					'name',
					'description',
					'unit',
					'img',
					'brand',
					'category',
					'type',
					'stock',
				]),
		]);

		const sortOferts = oferts.sort(function (a, b) {
			if (a.description < b.description) {
				return -1;
			}
			if (a.description > b.description) {
				return 1;
			}
			return 0;
		});

		res.status(200).json({
			ok: true,
			status: 200,
			total,
			data: {
				oferts: sortOferts,
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

const getOfert = async (req, res = response) => {
	try {
		const { id } = req.params;
		const ofert = await Ofert.findById(id).populate('product', [
			'name',
			'description',
			'unit',
			'img',
			'brand',
			'category',
			'type',
			'stock',
		]);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				ofert,
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
const getOfertByProductId = async (req, res = response) => {
	try {
		const { id } = req.params;
		const ofert = await Ofert.find({ product: id, state: true }).populate(
			'product',
			[
				'name',
				'description',
				'unit',
				'img',
				'brand',
				'category',
				'type',
				'stock',
			]
		);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				ofert,
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

const postOfert = async (req, res = response) => {
	try {
		const { state, ...body } = req.body;

		// Generar la data a guardar
		const data = {
			...body,
		};

		const ofert = new Ofert(data);

		// Guardar DB
		await ofert.save();

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				ofert,
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

const putOfert = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { state, ...data } = req.body;

		const ofert = await Ofert.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				ofert,
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

const deleteOfert = async (req, res = response) => {
	try {
		const { id } = req.params;
		await Ofert.findByIdAndUpdate(id, { state: false }, { new: true });

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

const ofertsWithCategory = async (req, res = response) => {
	try {
		const allOferts = await Ofert.aggregate([
			[
				{
					$match: {
						state: true,
					},
				},
				{
					$lookup: {
						from: 'products',
						localField: 'product',
						foreignField: '_id',
						as: 'product',
					},
				},
				{
					$unwind: {
						path: '$product',
					},
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'product.category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: {
						path: '$category',
					},
				},
			],
		]);
		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				oferts: allOferts,
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
	postOfert,
	getOferts,
	getOfert,
	getOfertByProductId,
	putOfert,
	deleteOfert,
	ofertsWithCategory,
};

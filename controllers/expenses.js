const { response } = require('express');
const { Expenses } = require('../models');

const getAllExpenses = async (req, res = response) => {
	try {
		const { limit = 1000000, from = 0 } = req.query;
		const query = { state: true };

		const [total, expenses] = await Promise.all([
			Expenses.countDocuments(query),
			Expenses.find(query).skip(Number(from)).limit(Number(limit)),
		]);

		res.status(200).json({
			ok: true,
			status: 200,
			total,
			data: {
				expenses,
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

const getExpenses = async (req, res = response) => {
	try {
		const { id } = req.params;
		const expenses = await Expenses.findById(id);

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				expenses,
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

const postExpenses = async (req, res = response) => {
	try {
		const { state, ...body } = req.body;

		// Generar la data a guardar
		const data = {
			...body,
		};

		const expenses = new Expenses(data);

		// Guardar DB
		await expenses.save();

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				expenses,
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

const putExpenses = async (req, res = response) => {
	try {
		const { id } = req.params;
		const { state, ...data } = req.body;

		const expenses = await Expenses.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json({
			ok: true,
			status: 200,
			data: {
				expenses,
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

const deleteExpenses = async (req, res = response) => {
	try {
		const { id } = req.params;
		await Expenses.findByIdAndUpdate(id, { state: false }, { new: true });

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
	postExpenses,
	getAllExpenses,
	getExpenses,
	putExpenses,
	deleteExpenses,
};

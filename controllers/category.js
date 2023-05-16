const { response } = require('express');
const { Category } = require('../models');

const getCategories = async (req, res = response) => {
	const { limit = 100, from = 0 } = req.query;
	const query = { state: true };

	const [total, categories] = await Promise.all([
		Category.countDocuments(query),
		Category.find(query)
			.populate('user', 'name')
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		categories,
	});
};

const getCategory = async (req, res = response) => {
	const { id } = req.params;
	const category = await Category.findById(id).populate('user', 'name');

	res.json(category);
};

const postCategory = async (req, res = response) => {
	try {
		const name = req.body.name;

		const categoryDB = await Category.findOne({ name });

		if (categoryDB) {
			return res.status(400).json({
				msg: `La categoría ${categoryDB.name}, ya existe`,
			});
		}

		// Generar la data a guardar
		const data = {
			name,
			user: req.user,
		};

		const category = new Category(data);

		// Guardar DB
		await category.save();

		res.status(201).json(category);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			status: 500,
			msg: error.message,
		});
	}
};

const putCategory = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	data.user = req.user;

	const category = await Category.findByIdAndUpdate(id, data, { new: true });

	res.json(category);
};

const deleteCategory = async (req, res = response) => {
	const { id } = req.params;
	const deleteCategory = await Category.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(deleteCategory);
};

module.exports = {
	postCategory,
	getCategories,
	getCategory,
	putCategory,
	deleteCategory,
};

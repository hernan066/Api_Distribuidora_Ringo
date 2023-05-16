const { validationResult } = require('express-validator');

const validateFields = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.mapped());
		return res.status(400).json(errors.mapped());
	}

	next();
};

module.exports = {
	validateFields,
};

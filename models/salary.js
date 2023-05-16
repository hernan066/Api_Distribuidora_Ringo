const { Schema, model } = require('mongoose');

const SalarySchema = Schema({
	employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	amount: { type: Number },
	typeOfCalculation: { type: String },
	typeOfContract: { type: String },
	state: { type: Boolean, default: true, required: true },
});

SalarySchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();
	return data;
};

module.exports = model('Salary', SalarySchema);

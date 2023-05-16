const { Schema, model } = require('mongoose');

const SupplierSchema = Schema(
	{
		businessName: { type: String, unique: true },
		cuit: { type: String },
		email: { type: String, unique: true },
		phone: { type: String },
		address: { type: String },
		province: { type: String },
		city: { type: String },
		zip: { type: String },
		state: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

SupplierSchema.methods.toJSON = function () {
	const { __v, ...supplier } = this.toObject();
	return supplier;
};

module.exports = model('Supplier', SupplierSchema);

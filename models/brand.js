const { Schema, model } = require('mongoose');

const BrandSchema = Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

BrandSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();
	return data;
};

module.exports = model('Brand', BrandSchema);

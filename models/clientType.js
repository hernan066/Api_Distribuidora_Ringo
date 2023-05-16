const { Schema, model } = require('mongoose');

const ClientTypeSchema = Schema(
	{
		clientType: {
			type: String,
			required: [true],
		},
	},
	{ timestamps: true }
);

ClientTypeSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();
	return data;
};

module.exports = model('ClientType', ClientTypeSchema);

const { Schema, model } = require('mongoose');

const PointsSchema = Schema(
	{
		clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
		points: { type: Number },
		action: { type: String }, // [buy, recommendation, exchange]
		recommendedClientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			default: null,
		},
		orderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
		state: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

PointsSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();

	return data;
};

module.exports = model('Points', PointsSchema);

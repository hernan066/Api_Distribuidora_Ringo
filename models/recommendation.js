const { Schema, model } = require('mongoose');

const RecommendationSchema = Schema(
	{
		clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
		recommendedClient: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			default: null,
		},
		recommendedUser: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},

		state: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

RecommendationSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();

	return data;
};

module.exports = model('Recommendation', RecommendationSchema);

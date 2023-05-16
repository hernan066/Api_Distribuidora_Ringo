const { Schema, model } = require('mongoose');

const DeliveryTruckSchema = Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	distributor: {
		type: Schema.Types.ObjectId,
		ref: 'Distributor',
		required: true,
	},
	defaultZone: {
		type: Schema.Types.ObjectId,
		ref: 'DeliveryZone',
		required: true,
	},
	truckId: { type: String },
	patent: { type: String },
	maximumLoad: { type: Number },
	coldChamber: { type: Boolean },
	state: { type: Boolean, default: true, required: true },
});

DeliveryTruckSchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();
	return data;
};

module.exports = model('DeliveryTruck', DeliveryTruckSchema);

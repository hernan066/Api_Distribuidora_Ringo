const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
	{
		userCashier: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // id del usuario cajero
		userSeller: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // id del usuario vendedor
		client: { type: Schema.Types.ObjectId, ref: 'Client' },
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		receiptId: { type: String },

		cashierMode: { type: Boolean, default: false }, // true = enviado a caja

		orderItems: [
			{
				uniqueId: { type: String },
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				name: { type: String, required: true },
				unit: { type: String },
				description: { type: String },
				img: { type: String },
				totalQuantity: { type: Number, required: true },
				totalPrice: { type: Number, required: true },
				unitPrice: { type: Number, required: true },
				unitCost: { type: Number },
				stockId: { type: String },
			},
		],

		shippingAddress: {
			addressId: { type: Schema.Types.ObjectId, ref: 'ClientAddress' },
			name: { type: String },
			lastName: { type: String },
			phone: { type: String },
			address: { type: String },
			flor: { type: String },
			department: { type: String },
			city: { type: String },
			province: { type: String },
			zip: { type: Number },
			lat: { type: Number },
			lng: { type: Number },
		},

		deliveryTruck: { type: Schema.Types.ObjectId, ref: 'DeliveryTruck' },
		employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
		deliveryZone: { type: Schema.Types.ObjectId, ref: 'DeliveryZone' },
		numberOfItems: { type: Number, required: true },
		tax: { type: Number },
		subTotal: { type: Number, required: true },
		total: { type: Number, required: true },

		status: { type: String, default: 'Pendiente' },
		active: { type: Boolean, default: false },

		commentary: { type: String },

		payment: {
			cash: { type: Number, default: 0 },
			transfer: { type: Number, default: 0 },
			debt: { type: Number, default: 0 },
		},

		paid: { type: Boolean, default: false },
		discount: { type: Number, default: 0 },

		deliveryDate: { type: Date },

		state: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

module.exports = model('Order', OrderSchema);

/* TODO validar status */

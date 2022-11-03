const { Schema, model } = require('mongoose');

const OfertSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        unique: true
    },
    unity: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


OfertSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Ofert', OfertSchema );
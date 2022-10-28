const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    phone: { type: String, default: null },
    status: { type: String, default: 'pending' },
    step: { type: Number, default: 0 },
    products: [{type: String}],
    name: { type: String, default: null },
    address: { type: String, default: null },
    date: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
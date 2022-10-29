const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      
      orderItems: [{
      _id     : { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      title   : { type: String, required: true },
      quantity: { type: Number, required: true },
      slug    : { type: String, required: true },
      image   : { type: String, required: true },
      price   : { type: Number, required: true },
      
  }],
    
    shippingAddress: {
      firstName   : { type: String, required: true },
      lastName    : { type: String, required: true },
      phone       : { type: String, required: true },
      address     : { type: String, required: true },
      flor        : { type: String },
      department  : { type: String },
      city        : { type: String },
     
  },
    numberOfItems: { type: Number, required: true },
    tax          : { type: Number},
    subTotal     : { type: Number, required: true },
    total        : { type: Number, required: true },
    
    status       :{ type: String, default: 'pending' },
    
   
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);
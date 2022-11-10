const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      
      orderItems: [{
      productId     : { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name          : {type: String,required:true },
      unit          : {type: String},
      description   : {type: String},
      img           : {type: String },
      quantity      : { type: Number, required: true },
      price         : { type: Number, required: true },
      
  }],
    
    shippingAddress: {
      name        : { type: String, required: true },
      lastname    : { type: String, required: true },
      phone       : { type: String, required: true },
      address     : { type: String, required: true },
      flor        : { type: String },
      department  : { type: String },
      city        : { type: String },
      province    : { type: String },
      zip         : { type: Number },
     
  },
    deliveryTruckId     : {type: Schema.Types.ObjectId,ref: 'DeliveryTruck',},
    employeeId          : {type: Schema.Types.ObjectId,ref: 'Employee',},
    deliveryZoneId      : {type: Schema.Types.ObjectId,ref: 'DeliveryZone',},
    numberOfItems     : { type: Number, required: true },
    tax               : { type: Number},
    subTotal          : { type: Number, required: true },
    total             : { type: Number, required: true },
    
    status            :{ type: String, default: 'pending' },
    
   
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);

/* TODO validar status */
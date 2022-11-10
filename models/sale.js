const { Schema, model } = require('mongoose');

const SaleSchema = Schema({
    clientId                    : {type: Schema.Types.ObjectId,ref: 'Client', required: true},
    deliveryTruckId             : {type: Schema.Types.ObjectId,ref: 'DeliveryTruck',required: true},
    orderId                     : {type: Schema.Types.ObjectId,ref: 'Order',required: true},
    commissionDeliveryTruck     : {type: Number,},
    totalCost                   : {type: Number,},
    totalSale                   : {type: Number,},
    profit                      : {type: Number,},
    state                       : {type: Boolean,default: true,required: true},                      
});


SaleSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Sale', SaleSchema );
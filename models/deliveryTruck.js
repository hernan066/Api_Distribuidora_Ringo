const { Schema, model } = require('mongoose');

const DeliveryTruckSchema = Schema({
    userId              : {type: Schema.Types.ObjectId,ref: 'User', required: true},
    distributorId       : {type: Schema.Types.ObjectId,ref: 'Distributor',required: true},
    deliveryZoneId      : {type: Schema.Types.ObjectId,ref: 'DeliveryZone',required: true},
    deliveryName        : {type: String,},
    deliveryLastname    : {type: String,},
    patent              : {type: String,},
    maximumLoad         : {type: Number,},
    coldChamber         : {type: Boolean,},
    state               : {type: Boolean,default: true,required: true},
});


DeliveryTruckSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'DeliveryTruck', DeliveryTruckSchema );
const { Schema, model } = require('mongoose');

const ClientSchema = Schema({
    user                : {type: Schema.Types.ObjectId,ref: 'User', required: true},
    distributor         : {type: Schema.Types.ObjectId,ref: 'Distributor',required: true},
    deliveryZone        : {type: Schema.Types.ObjectId,ref: 'DeliveryZone',required: true},
    deliveryName        : {type: String,},
    deliveryLastname    : {type: String,},
    patent              : {type: String,},
    maximumLoad         : {type: Number,},
    coldChamber         : {type: Boolean,},
    state               : {type: Boolean,default: true,required: true},
});


ClientSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Client', ClientSchema );
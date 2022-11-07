const { Schema, model } = require('mongoose');

const DeliverySubZoneSchema = Schema({
    
    deliveryZone        : {type: Schema.Types.ObjectId,ref: 'DeliveryZone', required: true},
    name                : {type: String,},
    km2                 : {type: Number,},
    blocks              : {type: Number,},
    busStop             : {type: Number,},
    totalHouses         : {type: Number,},
    clientHouses        : {type: Number,},
    totalShops          : {type: Number,},
    clientShops         : {type: Number,},
   
    limits: [{
                north  : { type: String, required: true },
                south  : { type: String, required: true },
                east   : { type: String, required: true },
                west   : { type: String, required: true },
             }],
    state               : {type: Boolean,default: true,required: true},
},{ timestamps: true });


DeliverySubZoneSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'DeliverySubZone', DeliverySubZoneSchema );
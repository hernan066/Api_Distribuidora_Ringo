const { Schema, model } = require('mongoose');

const DeliveryZoneSchema = Schema({
    
    name                : {type: String,},
    cost                : {type: String,},
    province            : {type: String,},
    city                : {type: String,},
    zip                 : {type: String,},
    limits: [{
                north  : { type: String, required: true },
                south  : { type: String, required: true },
                east   : { type: String, required: true },
                west   : { type: String, required: true },
             }],
    state               : {type: Boolean,default: true,required: true},
});


DeliveryZoneSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'DeliveryZone', DeliveryZoneSchema );
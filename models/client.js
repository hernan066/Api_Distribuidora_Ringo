const { Schema, model } = require('mongoose');

const ClientSchema = Schema({
    user                : {type: Schema.Types.ObjectId,ref: 'User', required: true},
    clientCategory      : {type: Schema.Types.ObjectId,ref: 'ClientCategory',required: true},
    clientType          : {type: Schema.Types.ObjectId,ref: 'ClientType',required: true},
    cuit                : {type: Number,},
    state               : {type: Boolean,default: true,required: true},
});


ClientSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Client', ClientSchema );
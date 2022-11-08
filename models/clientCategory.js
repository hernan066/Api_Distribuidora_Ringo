const { Schema, model } = require('mongoose');

const ClientCategorySchema = Schema({
    clientCategory: {
        type: String,
        required: [true]
    }
},{ timestamps: true });
ClientCategorySchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}




module.exports = model( 'ClientCategory', ClientCategorySchema );
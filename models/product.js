const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name        : {type: String,required: [true, 'El nombre es obligatorio'],unique: true},
    price       : {type: Number,default: 0},
    stock       : {type: Number,default: 0},
    cost        : {type: Number,default: 0},
    discount    : {type: Number,default: 0},
    unit        : {type: String},
    description : {type: String },
    available   : {type: Boolean, default: true },
    img         : {type: String },
    state       : {type: Boolean,default: true,required: true},
    user        : {type: Schema.Types.ObjectId,ref: 'User', required: true},
    category    : {type: Schema.Types.ObjectId,ref: 'Category',required: true},
});


ProductSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Product', ProductSchema );

const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name        : {type: String,required:true },
    brand       : {type: String},
    unit        : {type: String},
    type        : {type: String},
    description : {type: String},
    available   : {type: Boolean, default: true },
    ofert       : {type: Boolean, default: false },
    img         : {type: String, default: "https://ik.imagekit.io/mrprwema7/No_image_available.svg_f8oa-E8hq.png?ik-sdk-version=javascript-1.4.3&updatedAt=1669124011945" },
    state       : {type: Boolean,default: true,required: true},
    user        : {type: Schema.Types.ObjectId,ref: 'User'},
    category    : {type: Schema.Types.ObjectId,ref: 'Category'},
},{ timestamps: true });


ProductSchema.methods.toJSON = function() {
    const { __v, state, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Product', ProductSchema );

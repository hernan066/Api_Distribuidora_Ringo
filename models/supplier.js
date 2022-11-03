const { Schema, model } = require("mongoose");

const SupplierSchema = Schema({
    businessName      : {type: String,},
    cuit              : {type: String,},
    email             : {type: String,unique: true,},
    phone             : {type: String,required: true,unique: true,},
    address           : {type: String},
    province          : {type: String},
    city              : {type: String},
    zip               : {type: String},
    state             : {type: Boolean,default: true,},
 
  
});

SupplierSchema.methods.toJSON = function () {
  const { __v, password, _id, ...supplier } = this.toObject();
  supplier.uid = _id;
  return supplier;
};

module.exports = model("Supplier", UserSchema);
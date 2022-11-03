const { Schema, model } = require("mongoose");

const DistributorSchema = Schema({
  businessName      : {type: String,},
  cuit              : {type: String,},
  email             : {type: String,unique: true,},
  phone             : {type: String,required: true,unique: true,},
  maximum           : {type: String,required: true,}, //tope
  address           : {type: String},
  province          : {type: String},
  city              : {type: String},
  zip               : {type: String},
  state             : {type: Boolean,default: true,},
 
  
});

DistributorSchema.methods.toJSON = function () {
  const { __v, password, _id, ...distributor } = this.toObject();
  distributor.uid = _id;
  return distributor;
};

module.exports = model("Distributor", DistributorSchema);

const { Schema, model } = require("mongoose");

const EmployeeSchema = Schema({
  userId    : {type: Schema.Types.ObjectId,ref: 'User', required: true},
  docket    : {type: String, unique: true}, //legajo
  name      : {type: String,},
  lastName  : {type: String,},
  cuil      : {type: Number,},
  email     : {type: String,},
  phone     : {type: String,},
  address   : {type: String},
  province  : {type: String},
  city      : {type: String},
  zip       : {type: Number},
  state     : {type: Boolean,default: true,},
 
  
},{ timestamps: true });

EmployeeSchema.methods.toJSON = function () {
  const { __v, ...employee } = this.toObject();
 
  return employee;
};

module.exports = model("Employee", EmployeeSchema);

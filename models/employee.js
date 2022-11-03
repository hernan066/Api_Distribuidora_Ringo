const { Schema, model } = require("mongoose");

const EmployeeSchema = Schema({
  user      : {type: Schema.Types.ObjectId,ref: 'User', required: true},
  docket    : {type: String, unique: true}, //legajo
  name      : {type: String,},
  lastName  : {type: String,},
  email     : {type: String,},
  phone     : {type: String,},
  address   : {type: String},
  province  : {type: String},
  city      : {type: String},
  zip       : {type: String},
  state     : {type: Boolean,default: true,},
 
  
});

EmployeeSchema.methods.toJSON = function () {
  const { __v, password, _id, ...employee } = this.toObject();
  employee.uid = _id;
  return Employee;
};

module.exports = model("Employee", UserSchema);

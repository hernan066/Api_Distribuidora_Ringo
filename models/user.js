const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name      : {type: String,},
  lastName  : {type: String,},
  email     : {type: String,unique: true,},
  phone     : {type: String,required: true,unique: true,},
  password  : {type: String,required: true,},
  img       : {type: String},
  state     : {type: Boolean,default: true,},
  google    : {type: Boolean,default: false,},
  rol       : {
                type: String,
                required: true,
                default: "USER_ROLE",
                emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);

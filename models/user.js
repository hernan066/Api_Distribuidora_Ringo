const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name      : {type: String,},
  lastName  : {type: String,},
  email     : {type: String,unique: true,},
  phone     : {type: String,required: true,unique: true,},
  password  : {type: String,required: true,},
  avatar    : {type: String, default:"default_avatar.jpg"},
  address   : {type: String},
  province  : {type: String},
  city      : {type: String},
  zip       : {type: String},
  state     : {type: Boolean,default: true,},
  google    : {type: Boolean,default: false,},
  rol       : {
                type: String,
                required: true,
                default: "CLIENT_ROLE",
                emun: ["ADMIN_ROLE", "CLIENT_ROLE"],
  },
  
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);

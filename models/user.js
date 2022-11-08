const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name          : {type: String,},
  lastName      : {type: String,},
  email         : {type: String,unique: true,},
  phone         : {type: String,required: true,unique: true,},
  password      : {type: String,required: true,},
  avatar        : {type: String, default:"default_avatar.jpg"},
  google        : {type: Boolean,default: false,},
  state         : {type: Boolean,default: true,},
  role          : {type: Schema.Types.ObjectId,ref: 'Role', required: true},
  userAddresses: [{
    address     : { type: String },
    flor        : { type: String },
    department  : { type: String },
    city        : { type: String },
    province    : { type: String },
    zip         : { type: Number },
 }],
 
  
},{ timestamps: true });

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);

const { Schema, model } = require("mongoose");

const ClientAddressSchema = Schema(
  {
    address         : { type: String },
    flor            : { type: String },
    department      : { type: String },
    city            : { type: String },
    province        : { type: String },
    zip             : { type: Number },
    phone           : { type: String },
    type            : { type: String },
    state           : { type: Boolean, default: true },
    user            : { type: Schema.Types.ObjectId, ref: "User" },
    client          : { type: Schema.Types.ObjectId, ref: "Client" },
   
  },
  { timestamps: true }
);

ClientAddressSchema.methods.toJSON = function () {
  const { __v, ...clientAddress } = this.toObject();
  return clientAddress;
};

module.exports = model("ClientAddress", ClientAddressSchema);

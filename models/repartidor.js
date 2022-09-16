const { Schema, model } = require("mongoose");

const RepartidorSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  patente: {
    type: String,
    required: [true, "La patente es obligatoria"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    default: "DELIVERY_ROLE",
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

RepartidorSchema.methods.toJSON = function () {
  const { __v, password, _id, ...repartidor } = this.toObject();
  repartidor.uid = _id;
  return repartidor;
};

module.exports = model("Repartidor", RepartidorSchema);

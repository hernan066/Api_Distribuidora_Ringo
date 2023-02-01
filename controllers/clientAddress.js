const { response } = require("express");
const { ClientAddress } = require("../models");

const getClientAddresses = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, clientAddress] = await Promise.all([
      ClientAddress.countDocuments(query),
      ClientAddress.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate("client")
        .populate("user", ["name", "lastName", "phone", "email"])
        .populate("deliveryZone", ["name", "cost"]),
    ]);

   /*  const orderClientAddress = clientAddress.sort(function(a, b){
      if(a.user.name < b.user.name) { return -1; }
      if(a.user.name > b.user.name) { return 1; }
      return 0;
  }) */

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        clientAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const getClientAddress = async (req, res = response) => {
  try {
    const { id } = req.params;
    const clientAddress = await ClientAddress.findById(id)
      .populate("client")
      .populate("user", ["name", "lastName", "phone", "email"])
      .populate("deliveryZone", ["name"]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const postClientAddress = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const clientAddress = new ClientAddress(data);

    // Guardar DB
    await clientAddress.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const putClientAddress = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const clientAddress = await ClientAddress.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const deleteClientAddress = async (req, res = response) => {
  try {
    const { id } = req.params;
    await ClientAddress.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};
const getUserAddress = async (req, res = response) => {
  try {
    const { id } = req.params;
    const clientAddress = await ClientAddress.find({ user: id, state: true })
      .populate("client")
      .populate("user", ["name", "lastName", "phone", "email"])
      .populate("deliveryZone", ["name", "cost"]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientAddress,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

module.exports = {
  postClientAddress,
  getClientAddresses,
  getClientAddress,
  putClientAddress,
  deleteClientAddress,
  getUserAddress
};

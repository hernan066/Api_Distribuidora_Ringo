const { response } = require("express");
const { Client } = require("../models");

const getClients = async (req, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const query = { state: true };

    const [total, clients] = await Promise.all([
      Client.countDocuments(query),
      Client.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("clientCategoryId")
      .populate("userId")
      .populate("clientTypeId"),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        clients,
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

const getClient = async (req, res = response) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id)
    .populate("clientCategoryId")
    .populate("userId")
    .populate("clientTypeId");

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client,
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

const postClient = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const clientDB = await Client.findOne({ cuit: body.cuit });

    if (clientDB) {
      return res.status(400).json({
        msg: `El cuit ${clientDB.cuit}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const client = new Client(data);

    // Guardar DB
    await client.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client,
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

const putClient = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const client = await Client.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client,
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

const deleteClient = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndUpdate(id, { state: false }, { new: true });

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

module.exports = {
  postClient,
  getClients,
  getClient,
  putClient,
  deleteClient,
};

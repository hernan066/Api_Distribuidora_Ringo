const { response } = require("express");
const { ClientType } = require("../models");

const getClientTypes = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, clientTypes] = await Promise.all([
      ClientType.countDocuments(query),
      ClientType.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        clientTypes,
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

const getClientType = async (req, res = response) => {
  try {
    const { id } = req.params;
    const clientType = await ClientType.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientType,
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

const postClientType = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const clientTypeDB = await ClientType.findOne({ clientType: body.clientType });

    if (clientTypeDB) {
      return res.status(400).json({
        msg: `El tipo de cliente ${clientTypeDB.clientType}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const clientType = new ClientType(data);

    // Guardar DB
    await clientType.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientType,
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

const putClientType = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const clientType = await ClientType.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientType,
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

const deleteClientType = async (req, res = response) => {
  try {
    const { id } = req.params;
    await ClientType.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postClientType,
  getClientTypes,
  getClientType,
  putClientType,
  deleteClientType,
};

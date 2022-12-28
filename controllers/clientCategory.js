const { response } = require("express");
const { ClientCategory } = require("../models");

const getClientCategories = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, clientCategories] = await Promise.all([
      ClientCategory.countDocuments(query),
      ClientCategory.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        clientCategories,
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

const getClientCategory = async (req, res = response) => {
  try {
    const { id } = req.params;
    const clientCategory = await ClientCategory.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientCategory,
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

const postClientCategory = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const clientCategoryDB = await ClientCategory.findOne({ clientCategory: body.clientCategory });

    if (clientCategoryDB) {
      return res.status(400).json({
        msg: `La categoría de cliente ${clientCategoryDB.clientCategory}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const clientCategory = new ClientCategory(data);

    // Guardar DB
    await clientCategory.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientCategory,
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

const putClientCategory = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const clientCategory = await ClientCategory.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientCategory,
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

const deleteClientCategory = async (req, res = response) => {
  try {
    const { id } = req.params;
    await ClientCategory.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postClientCategory,
  getClientCategories,
  getClientCategory,
  putClientCategory,
  deleteClientCategory,
};

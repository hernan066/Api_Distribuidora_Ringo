const { response } = require("express");
const { Sale } = require("../models");

const getSales = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, sales] = await Promise.all([
      Sale.countDocuments(query),
      Sale.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        sales,
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

const getSale = async (req, res = response) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        sale,
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

const postSale = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const sale = new Sale(data);

    // Guardar DB
    await sale.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        sale,
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

const putSale = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const sale = await Sale.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        sale,
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

const deleteSale = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Sale.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postSale,
  getSales,
  getSale,
  putSale,
  deleteSale,
};

const { response } = require("express");
const { ProductLot } = require("../models");

const getProductLots = async (req, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const query = { state: true };

    const [total, productLots] = await Promise.all([
      ProductLot.countDocuments(query),
      ProductLot.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate('supplier', 'businessName')
      .populate('product', ['name', 'description', 'unit']),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        productLots,
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

const getProductLot = async (req, res = response) => {
  try {
    const { id } = req.params;
    const productLot = await ProductLot.findById(id).populate("product", [
      "name",
      "description",
      "unit",
      "img",
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        productLot,
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

const postProductLot = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    

    // Generar la data a guardar
    const data = {
      ...body,
    };

    
    const productLot = new ProductLot(data);
    
    
    // Guardar DB
    await productLot.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        productLot,
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

const putProductLot = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const productLot = await ProductLot.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        productLot,
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

const deleteProductLot = async (req, res = response) => {
  try {
    const { id } = req.params;
    await ProductLot.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postProductLot,
  getProductLots,
  getProductLot,
  putProductLot,
  deleteProductLot,
};

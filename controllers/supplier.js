const { response } = require("express");
const { Supplier } = require("../models");

const getSuppliers = async (req, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const query = { state: true };

    const [total, suppliers] = await Promise.all([
      Supplier.countDocuments(query),
      Supplier.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        suppliers,
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

const getSupplier = async (req, res = response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        supplier,
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

const postSupplier = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const supplierDB = await Supplier.findOne({ businessName: body.businessName });

    if (supplierDB) {
      return res.status(400).json({
        msg: `El proveedor ${supplierDB.businessName}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const supplier = new Supplier(data);

    // Guardar DB
    await supplier.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        supplier,
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

const putSupplier = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        supplier,
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

const deleteSupplier = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Supplier.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postSupplier,
  getSuppliers,
  getSupplier,
  putSupplier,
  deleteSupplier,
};

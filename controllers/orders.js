const { response } = require("express");
const { Order } = require("../models");

const getOrders = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate("deliveryTruck")
        .populate("employee")
        .populate("deliveryZone"),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        orders,
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

const getOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("deliveryTruck")
      .populate("employee")
      .populate("deliveryZone");

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        order,
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

const postOrder = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    //return res.send(req.body)

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const order = new Order(data);

    // Guardar DB
    await order.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        order,
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

const putOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const order = await Order.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        order,
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

const deleteOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postOrder,
  getOrders,
  getOrder,
  putOrder,
  deleteOrder,
};

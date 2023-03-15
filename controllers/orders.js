const { response } = require("express");
const { Order } = require("../models");

const getOrders = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0, active, delivery = "" } = req.query;
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

    if (delivery && delivery !== "" && active === "true") {
      console.log("entra", delivery);
      const ordersActives = await Order.find({
        active: true,
        deliveryTruck: delivery,
        state: true,
      })
        .populate("deliveryTruck")
        .populate("employee")
        .populate("deliveryZone");

      return res.status(200).json({
        ok: true,
        status: 200,
        total: ordersActives.length,
        data: {
          orders: ordersActives,
        },
      });
    }

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
      .populate("deliveryZone")
      .sort({ createdAt: 1 });

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

const getUserOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    const order = await Order.find({ userId: id, state: true })
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
const getClientOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ client: id, state: true })
      .populate("deliveryTruck")
      .populate("employee")
      .populate("deliveryZone");

    res.status(200).json({
      ok: true,
      status: 200,
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

const getOrdersToday = async (req, res = response) => {
  try {
    let today = new Date();

    let from = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );
    let to = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
      999
    );

    const query = {
      state: true,
      $and: [{ deliveryDate: { $gte: from } }, { deliveryDate: { $lte: to } }],
    };

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)

        .populate("deliveryTruck")
        .populate("employee")
        .populate("deliveryZone"),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      from,
      to,
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
const getOrdersByDay = async (req, res = response) => {
  try {
    const { days } = req.params;
    const orders = await Order.find({
      state: true,
      deliveryDate: {
        $lt: new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate() - +days)),
      },
    })
      .sort({ deliveryDate: 1 })
      .populate("deliveryTruck")
      .populate("employee")
      .populate("deliveryZone");

    res.status(200).json({
      ok: true,
      status: 200,
      total: orders.length,
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() - +days)),
      range: +days,
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

const getOrdersActives = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true, active: true };

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

module.exports = {
  postOrder,
  getOrders,
  getOrder,
  putOrder,
  deleteOrder,
  getUserOrder,
  getClientOrder,
  getOrdersToday,
  getOrdersActives,
  getOrdersByDay,
};

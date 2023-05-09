const { response } = require("express");
const { Order, Points, Client } = require("../models");

const getOrders = async (req, res = response) => {
  try {
    const { limit = 10000000, from = 0, active, delivery = "" } = req.query;
    const query = { state: true };

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate("deliveryTruck")
        .populate("employee")
        .populate("deliveryZone")
        .sort({ createdAt: -1 }),
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

const getOrdersPaginate = async (req, res = response) => {
  try {
    const { limit = 10000, page = 1, active = "false", paid } = req.query;
    // active = "false"  => all

    if (active === "true") {
      const query = { state: true, active: true };

      const [total, orders] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query)
          .skip(Number((page - 1) * limit))
          .limit(Number(limit * 1))
          .populate("deliveryTruck")
          .populate("employee")
          .populate("deliveryZone")
          .sort({ createdAt: -1 }),
      ]);

      return res.status(200).json({
        ok: true,
        status: 200,
        total,
        data: {
          orders,
        },
      });
    }
    if (paid === "false") {
      const query = { state: true, paid: false };

      const [total, orders] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query)
          .skip(Number((page - 1) * limit))
          .limit(Number(limit * 1))
          .populate("deliveryTruck")
          .populate("employee")
          .populate("deliveryZone")
          .sort({ createdAt: -1 }),
      ]);

      return res.status(200).json({
        ok: true,
        status: 200,
        total,
        data: {
          orders,
        },
      });
    }

    const query = { state: true };

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .skip(Number((page - 1) * limit))
        .limit(Number(limit * 1))
        .populate("deliveryTruck")
        .populate("employee")
        .populate("deliveryZone")
        .sort({ createdAt: -1 }),
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
    console.log(error);
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
    const { state, paid, subTotal, client, ...body } = req.body;

    const data = {
      paid,
      subTotal,
      client,
      ...body,
    };

    const order = new Order(data);

    // Si esta paga se cargan los puntos
    if (paid) {
      const dataPoints = {
        clientId: client,
        points: Math.trunc(subTotal),
        action: "buy",
        orderId: order._id,
      };

      const points = new Points(dataPoints);
      // Guardar DB
      await points.save();

      // actualizo puntos dentro de cliente
      const pointsData = await Points.find({ state: true, clientId: client });
      const totalPoints = pointsData.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      console.log(totalPoints);
      await Client.findByIdAndUpdate(client, { points: totalPoints });
    }

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

    const order = await Order.findByIdAndUpdate(id, data);

    // Si estaba impaga y paso a estar paga
    if (order.paid === false && req.body.paid === true) {
      const dataPoints = {
        clientId: order.client,
        points: Math.trunc(order.subTotal),
        action: "buy",
        orderId: order._id,
      };

      const points = new Points(dataPoints);
      // Guardar DB
      await points.save();

      // actualizo puntos dentro de cliente
      const pointsData = await Points.find({
        state: true,
        clientId: order.client,
      });
      const totalPoints = pointsData.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      console.log(totalPoints);
      const id = order.client;
      await Client.findByIdAndUpdate(id, { points: totalPoints });
    }

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
    const order = await Order.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    // Si esta paga se cargan los puntos
    if (order.paid) {
      await Points.findOneAndUpdate(
        { orderId: order._id },
        { state: false },
        { new: true }
      );

      // actualizo puntos dentro de cliente
      const pointsData = await Points.find({
        state: true,
        clientId: order.client,
      });
      const totalPoints = pointsData.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      console.log(totalPoints);
      const id = order.client;
      await Client.findByIdAndUpdate(id, { points: totalPoints });
    }

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
      .populate("deliveryZone")
      .sort({ createdAt: -1 });

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

const getClientOrderDebt = async (req, res = response) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({
      state: true,
      client: id,
      paid: false,
      status: "Entregado",
    });

    res.status(200).json({
      ok: true,
      status: 200,
      total: orders.length,
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
  getOrdersPaginate,
  getClientOrderDebt,
};

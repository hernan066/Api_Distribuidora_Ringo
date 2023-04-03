const { response } = require("express");
const { Order } = require("../models");
const { Client } = require("../models");

// ordenes, total, por mes, por dia
const reportTotalOrdersByMonth = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$deliveryDate",
            },
            year: {
              $year: "$deliveryDate",
            },
          },
          totalSales: {
            $sum: "$total",
          },
          totalCash: {
            $sum: "$payment.cash",
          },
          totalTransfer: {
            $sum: "$payment.transfer",
          },
          totalDebt: {
            $sum: "$payment.debt",
          },
        },
      },
      {
        $project: {
          _id: 0,

          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          totalSales: 1,
          totalCash: 1,
          totalTransfer: 1,
          totalDebt: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: ["$month", "-", "$year"],
          },
          totalSales: 1,
          totalCash: 1,
          totalTransfer: 1,
          totalDebt: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
const reportTotalOrdersByDay = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: "$deliveryDate",
            },
            month: {
              $month: "$deliveryDate",
            },
            year: {
              $year: "$deliveryDate",
            },
          },
          totalSales: {
            $sum: "$total",
          },
          totalCash: {
            $sum: "$payment.cash",
          },
          totalTransfer: {
            $sum: "$payment.transfer",
          },
          totalDebt: {
            $sum: "$payment.debt",
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $toString: "$_id.day",
          },
          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          totalSales: 1,
          totalCash: 1,
          totalTransfer: 1,
          totalDebt: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: ["$day", "-", "$month", "-", "$year"],
          },
          totalSales: 1,
          totalCash: 1,
          totalTransfer: 1,
          totalDebt: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
const reportTotalOrders = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $group: {
          _id: {},
          totalSales: {
            $sum: "$total",
          },
          totalCash: {
            $sum: "$payment.cash",
          },
          totalTransfer: {
            $sum: "$payment.transfer",
          },
          totalDebt: {
            $sum: "$payment.debt",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalCash: 1,
          totalTransfer: 1,
          totalDebt: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
// productos, total, por mes, por dia
const reportTotalOrdersProducts = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $group: {
          _id: {
            name: "$orderItems.description",
            img: "$orderItems.img",
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          img: "$_id.img",
          count: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
const reportTotalOrdersProductsByDay = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $project: {
          deliveryDate: 1,
          orderItems: 1,
          CostTotal: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: "$deliveryDate",
            },
            month: {
              $month: "$deliveryDate",
            },
            year: {
              $year: "$deliveryDate",
            },
            name: "$orderItems.description",
            img: "$orderItems.img",
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
          total: {
            $sum: "$orderItems.totalPrice",
          },
          totalCost: {
            $sum: "$CostTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $toString: "$_id.day",
          },
          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          name: "$_id.name",
          img: "$_id.img",
          count: 1,
          total: 1,
          totalCost: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: ["$day", "-", "$month", "-", "$year"],
          },
          name: 1,
          img: 1,
          count: 1,
          total: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$total", "$totalCost"],
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
const reportTotalOrdersProductsByMonth = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$deliveryDate",
            },
            year: {
              $year: "$deliveryDate",
            },
            name: "$orderItems.description",
            img: "$orderItems.img",
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
        },
      },
      {
        $project: {
          _id: 0,

          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          name: "$_id.name",
          img: "$_id.img",
          count: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: ["$month", "-", "$year"],
          },
          name: 1,
          img: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
const reportTotalOrdersProductsByRange = async (req, res = response) => {
  try {
    const { from, to } = req.body; // "Tue, 21 Mar 2023 00:00:00 GMT"
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date(from),
            $lt: new Date(to),
          },
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $project: {
          deliveryDate: 1,
          orderItems: 1,
          CostTotal: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            name: "$orderItems.description",
            img: "$orderItems.img",
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
          total: {
            $sum: "$orderItems.totalPrice",
          },
          totalCost: {
            $sum: "$CostTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          img: "$_id.img",
          count: 1,
          total: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$total", "$totalCost"],
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      from,
      to,
      total: report.length,
      data: {
        report,
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
const reportTotalOrdersProductsByRangeTest = async (req, res = response) => {
  try {
    const { from, to } = req.body;
    console.log(from, to); // "Tue, 21 Mar 2023 00:00:00 GMT"
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date(from),
            $lt: new Date(to),
          },
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $project: {
          deliveryDate: 1,
          orderItems: 1,
          CostTotal: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            id: "$orderItems.productId",
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
          total: {
            $sum: "$orderItems.totalPrice",
          },
          totalCost: {
            $sum: "$CostTotal",
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.id",
          foreignField: "_id",
          as: "productOrder",
        },
      },
      {
        $unwind: {
          path: "$productOrder",
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$productOrder._id",
          name: "$productOrder.name",
          img: "$productOrder.img",
          count: 1,
          total: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$total", "$totalCost"],
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      from,
      to,
      total: report.length,
      data: {
        report,
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
// clientes, total, por mes
const reportNewClientByMonth = async (req, res = response) => {
  try {
    const report = await Client.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          count: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: ["$month", "-", "$year"],
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        report,
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
// payments
const reportPaymentByRangeDay = async (req, res = response) => {
  try {
    const { from, to } = req.body;
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date(from),
            $lt: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: "$deliveryDate",
            },
            month: {
              $month: "$deliveryDate",
            },
            year: {
              $year: "$deliveryDate",
            },
          },
          cashTotal: {
            $sum: "$payment.cash",
          },
          transferTotal: {
            $sum: "$payment.transfer",
          },
          debtTotal: {
            $sum: "$payment.debt",
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $toString: "$_id.day",
          },
          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
          cashTotal: 1,
          transferTotal: 1,
          debtTotal: 1,
        },
      },
      {
        $project: {
          cashTotal: 1,
          transferTotal: 1,
          debtTotal: 1,
          date: {
            $concat: ["$day", "-", "$month", "-", "$year"],
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      from,
      to,
      data: {
        report,
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
  reportTotalOrdersByMonth,
  reportTotalOrdersByDay,
  reportTotalOrders,
  reportTotalOrdersProducts,
  reportTotalOrdersProductsByDay,
  reportTotalOrdersProductsByMonth,
  reportTotalOrdersProductsByRange,
  reportTotalOrdersProductsByRangeTest,
  reportNewClientByMonth,
  reportPaymentByRangeDay,
};

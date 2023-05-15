const { response } = require("express");
const { Order, Product } = require("../models");
const { Client } = require("../models");
const { ObjectId } = require("mongodb");

// ordenes, total, por mes, por dia
const reportTotalOrdersByMonth = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date("Tue, 21 Mar 2023 03:00:00 GMT"),
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
          totalSell: {
            $sum: "$orderItems.totalPrice",
          },
          totalProfits: {
            $subtract: ["$totalSell", "$CostTotal"],
          },
        },
      },
      {
        $project: {
          deliveryDate: 1,
          orderItems: 1,
          CostTotal: 1,
          totalSell: 1,
          totalProfits: {
            $subtract: ["$totalSell", "$CostTotal"],
          },
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
          totalSell: {
            $sum: "$totalSell",
          },
          totalCost: {
            $sum: "$CostTotal",
          },
          totalProfits: {
            $sum: "$totalProfits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCost: 1,
          totalSell: 1,
          totalProfits: 1,
          month: "$_id.month",
          year: "$_id.year",
        },
      },
      {
        $sort: {
          month: 1,
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
//Limitado desde el 21/03/2023
const reportTotalOrders21_03 = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date("Tue, 21 Mar 2023 03:00:00 GMT"),
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
      {
        $sort: {
          totalProfits: -1,
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
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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
const reportTotalIndividualProduct = async (req, res = response) => {
  const { id } = res.params
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          deliveryDate: {
            $gt: new Date("Tue, 21 Mar 2023 03:00:00 GMT"),
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
      {
        $sort: {
          totalProfits: -1,
        },
      },
      {
        $match: {
          productId: new ObjectId(id)
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
          total: { $sum: ["$cashTotal", "$transferTotal", "$debtTotal"] },
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
const reportTotalSellByRangeDay = async (req, res = response) => {
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
          },
          count: {
            $sum: "$orderItems.totalQuantity",
          },
          totalSell: {
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
          count: 1,
          totalSell: 1,
          totalCost: 1,
        },
      },
      {
        $project: {
          count: 1,
          totalSell: 1,
          totalCost: 1,
          date: {
            $concat: ["$month", "-", "$day", "-", "$year"],
          },
          totalProfits: {
            $subtract: ["$totalSell", "$totalCost"],
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
// stock
const reportTotalStock = async (req, res = response) => {
  try {
    const report = await Product.aggregate([
      {
        $match: {
          state: true,
        },
      },
      {
        $unwind: {
          path: "$stock",
        },
      },
      {
        $project: {
          name: 1,
          img: 1,
          stock: 1,
          actualStock: "$stock.stock",
        },
      },
      {
        $match: {
          actualStock: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
            img: "$img",
          },
          actualStock: {
            $sum: "$stock.stock",
          },
          quantityBuy: {
            $sum: "$stock.quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          img: "$_id.img",
          actualStock: 1,
          quantityBuy: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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

// clients
const reportTotalClientDebt = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          paid: false,
          status: "Entregado",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "clientOrder",
        },
      },
      {
        $unwind: {
          path: "$clientOrder",
        },
      },
      {
        $group: {
          _id: {
            id: "$client",
            name: "$clientOrder.name",
            lastName: "$clientOrder.lastName",
          },
          totalDebt: {
            $sum: "$payment.debt",
          },
          totalCash: {
            $sum: "$payment.cash",
          },
          totalTransfer: {
            $sum: "$payment.transfer",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalDebt: 1,
          totalCash: 1,
          totalTransfer: 1,
          name: "$_id.name",
          lastName: "$_id.lastName",
          clientId: "$_id.id"
        },
      },
      {
        $sort: {
          totalDebt: -1,
        },
      },
      {
        $match: {
          totalDebt: {
            $gt: 0,
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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

const reportTotalClientBuyByRangeDays = async (req, res = response) => {
  try {
    const { from, to } = req.body;
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          status: "Entregado",
          deliveryDate: {
            $gt: new Date(from),
            $lt: new Date(to),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "clientOrder",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $unwind: {
          path: "$clientOrder",
        },
      },
      {
        $project: {
          _id: 0,
          deliveryDate: 1,
          client: 1,
          userId: "$clientOrder._id",
          name: "$clientOrder.name",
          lastName: "$clientOrder.lastName",
          totalBuy: "$orderItems.totalPrice",
          orderItems: 1,
          totalCost: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $project: {
          deliveryDate: 1,
          client: 1,
          userId: 1,
          name: 1,
          lastName: 1,
          orderItems: 1,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$totalBuy", "$totalCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            name: "$name",
            lastName: "$lastName",
          },
          totalCost: {
            $sum: "$totalCost",
          },
          totalBuy: {
            $sum: "$totalBuy",
          },
          totalProfits: {
            $sum: "$totalProfits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: 1,
          name: "$_id.name",
          lastName: "$_id.lastName",
          userId: "$_id.userId",
          totalProfits: 1,
        },
      },
      {
        $sort: {
          totalBuy: -1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total: report.length,
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
const reportTotalClientBuyAll = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          status: "Entregado",
          deliveryDate: {
            $gt: new Date(
              "Tue, 21 Mar 2023 03:00:00 GMT"
            ),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "clientOrder",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $unwind: {
          path: "$clientOrder",
        },
      },
      {
        $project: {
          _id: 0,
          deliveryDate: 1,
          client: 1,
          userId: "$clientOrder._id",
          clientId: "$client",
          name: "$clientOrder.name",
          lastName: "$clientOrder.lastName",
          totalBuy: "$orderItems.totalPrice",
          orderItems: 1,
          totalCost: {
            $multiply: [
              "$orderItems.totalQuantity",
              "$orderItems.unitCost",
            ],
          },
        },
      },
      {
        $project: {
          deliveryDate: 1,
          client: 1,
          userId: 1,
          name: 1,
          lastName: 1,
          orderItems: 1,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$totalBuy", "$totalCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            clientId: "$client",
            name: "$name",
            lastName: "$lastName",
          },
          totalCost: {
            $sum: "$totalCost",
          },
          totalBuy: {
            $sum: "$totalBuy",
          },
          totalProfits: {
            $sum: "$totalProfits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: 1,
          name: "$_id.name",
          lastName: "$_id.lastName",
          userId: "$_id.userId",
          clientId: "$_id.clientId",
          totalProfits: 1,
        },
      },
      {
        $sort: {
          totalBuy: -1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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
const reportTotalClientBuyIndividual = async (req, res = response) => {
  try {
    const { id } = req.params;
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          client: new ObjectId(id),
          status: "Entregado",
          deliveryDate: {
            $gt: new Date("Tue, 21 Mar 2023 03:00:00 GMT"),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "clientOrder",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $unwind: {
          path: "$clientOrder",
        },
      },
      {
        $project: {
          _id: 0,
          deliveryDate: 1,
          client: 1,
          userId: "$clientOrder._id",
          name: "$clientOrder.name",
          lastName: "$clientOrder.lastName",
          totalBuy: "$orderItems.totalPrice",
          orderItems: 1,
          totalCost: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $project: {
          deliveryDate: 1,
          client: 1,
          userId: 1,
          name: 1,
          lastName: 1,
          orderItems: 1,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$totalBuy", "$totalCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            name: "$name",
            lastName: "$lastName",
          },
          totalCost: {
            $sum: "$totalCost",
          },
          totalBuy: {
            $sum: "$totalBuy",
          },
          totalProfits: {
            $sum: "$totalProfits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: 1,
          name: "$_id.name",
          lastName: "$_id.lastName",
          userId: "$_id.userId",
          totalProfits: 1,
        },
      },
      {
        $sort: {
          totalBuy: -1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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
const reportTotalClientBuyIndividualByDay = async (req, res = response) => {
  try {
    const { id } = req.params;
    const report = await Order.aggregate([
      {
        $match: {
          state: true,
          client: new ObjectId(id),
          status: "Entregado",
          deliveryDate: {
            $gt: new Date("Tue, 21 Mar 2023 03:00:00 GMT"),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "clientOrder",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $unwind: {
          path: "$clientOrder",
        },
      },
      {
        $project: {
          _id: 0,
          deliveryDate: 1,
          client: 1,
          userId: "$clientOrder._id",
          name: "$clientOrder.name",
          lastName: "$clientOrder.lastName",
          totalBuy: "$orderItems.totalPrice",
          orderItems: 1,
          totalCost: {
            $multiply: ["$orderItems.totalQuantity", "$orderItems.unitCost"],
          },
        },
      },
      {
        $project: {
          deliveryDate: 1,
          client: 1,
          userId: 1,
          name: 1,
          lastName: 1,
          orderItems: 1,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: {
            $subtract: ["$totalBuy", "$totalCost"],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            name: "$name",
            lastName: "$lastName",
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
          totalCost: {
            $sum: "$totalCost",
          },
          totalBuy: {
            $sum: "$totalBuy",
          },
          totalProfits: {
            $sum: "$totalProfits",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBuy: 1,
          totalCost: 1,
          totalProfits: 1,
          name: "$_id.name",
          lastName: "$_id.lastName",
          userId: "$_id.userId",
          totalProfits: 1,
          day: {
            $toString: "$_id.day",
          },
          month: {
            $toString: "$_id.month",
          },
          year: {
            $toString: "$_id.year",
          },
        },
      },
      {
        $project: {
          totalBuy: 1,
          totalCost: 1,
          totalProfits: 1,
          name: 1,
          lastName: 1,
          userId: 1,
          totalProfits: 1,
          date: {
            $concat: ["$day", "-", "$month", "-", "$year"],
          },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
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

module.exports = {
  reportTotalOrdersByMonth,
  reportTotalOrdersByDay,
  reportTotalOrders,
  reportTotalOrders21_03,
  reportTotalOrdersProducts,
  reportTotalOrdersProductsByDay,
  reportTotalOrdersProductsByMonth,
  reportTotalOrdersProductsByRange,
  reportTotalOrdersProductsByRangeTest,
  reportTotalIndividualProduct,
  reportNewClientByMonth,
  reportPaymentByRangeDay,
  reportTotalSellByRangeDay,
  reportTotalStock,
  reportTotalClientDebt,
  reportTotalClientBuyAll,
  reportTotalClientBuyIndividual,
  reportTotalClientBuyByRangeDays,
  reportTotalClientBuyIndividualByDay,
};

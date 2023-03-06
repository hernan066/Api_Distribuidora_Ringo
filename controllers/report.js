const { response } = require("express");
const { Order } = require("../models");
const { Client } = require("../models");

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
const reportTotalOrdersProducts = async (req, res = response) => {
  try {
    const report = await Order.aggregate([
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
const reportNewClientByMonth = async (req, res = response) => {
  try {
    const report = await Client.aggregate([
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

module.exports = {
  reportTotalOrdersByMonth,
  reportTotalOrdersByDay,
  reportTotalOrdersProducts,
  reportNewClientByMonth,
};

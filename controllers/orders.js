const { Order } = require("../models");


const saveOrder = async (number, str) => {
  const order = str.split("-");

  const newOrder = new Order({
    state: "activa",
    number: number,
    products: order[1].trim(),
    name: order[2].trim(),
    address: order[3].trim(),
    date: Date.now(),
  });

  try {
    await newOrder.save();
    console.log("Orden guardada>>>>>>");
  } catch (error) {
    console.log(error);
  }
};
const getAllorders = async (req, res) => {
  const { limit = 100, init = 0 } = req.query;

  const [total, orders] = await Promise.all([
    Order.countDocuments(),
    Order.find().skip(Number(init)).limit(Number(limit)),
  ]);

  res.json({
    total,
    orders,
  });
};

const getAllordersByNumber = async (req, res) => {
  const { number } = req.params;

  const { limit = 100, init = 0 } = req.query;

  const [total, orders] = await Promise.all([
    Order.countDocuments({ number }),
    Order.find({ number }).skip(Number(init)).limit(Number(limit)),
  ]);

  res.json({
    total,
    orders,
  });
};
const postNewOrder = async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { saveOrder, getAllorders, getAllordersByNumber, postNewOrder };

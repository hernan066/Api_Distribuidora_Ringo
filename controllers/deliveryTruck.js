const { response } = require("express");
const { DeliveryTruck } = require("../models");

const getDeliveryTrucks = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, deliveryTrucks] = await Promise.all([
      DeliveryTruck.countDocuments(query),
      DeliveryTruck.find(query)
        .populate("distributor")
        .populate("user")
        .populate("defaultZone")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        deliveryTrucks,
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

const getDeliveryTruck = async (req, res = response) => {
  try {
    const { id } = req.params;
    const deliveryTruck = await DeliveryTruck.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliveryTruck,
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
const getUserDeliveryTruck = async (req, res = response) => {
  try {
    const { id } = req.params;
    const deliveryTruck = await DeliveryTruck.find({ user: id, state: true })
      .populate("distributor")
      .populate("user", ["name", "lastName", "phone", "email"])
      .populate("defaultZone", ["name", "cost"]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliveryTruck,
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

const postDeliveryTruck = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const deliveryTruckDB = await DeliveryTruck.findOne({
      patent: body.patent,
    });

    if (deliveryTruckDB) {
      return res.status(400).json({
        msg: `La patente ${deliveryTruckDB.patent}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const deliveryTruck = new DeliveryTruck(data);

    // Guardar DB
    await deliveryTruck.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliveryTruck,
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

const putDeliveryTruck = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const deliveryTruck = await DeliveryTruck.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliveryTruck,
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

const deleteDeliveryTruck = async (req, res = response) => {
  try {
    const { id } = req.params;
    await DeliveryTruck.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postDeliveryTruck,
  getDeliveryTrucks,
  getDeliveryTruck,
  putDeliveryTruck,
  deleteDeliveryTruck,
  getUserDeliveryTruck,
};

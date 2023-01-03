const { response } = require("express");
const { DeliverySubZone } = require("../models");

const getDeliverySubZones = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, deliverySubZones] = await Promise.all([
      DeliverySubZone.countDocuments(query),
      DeliverySubZone.find(query)
      .skip(Number(from))
      .limit(Number(limit))
      .populate("deliveryZone", ["name"]),
    ]);

    const order = deliverySubZones.sort(function(a, b){
      if(a.deliveryZone.name < b.deliveryZone.name) { return -1; }
      if(a.deliveryZone.name > b.deliveryZone.name) { return 1; }
      return 0;
  })

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        deliverySubZones: order,
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

const getDeliverySubZone = async (req, res = response) => {
  try {
    const { id } = req.params;
    const deliverySubZone = await DeliverySubZone.findById(id).populate("deliveryZone", ["name"]);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliverySubZone,
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

const postDeliverySubZone = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const deliverySubZoneDB = await DeliverySubZone.findOne({ name: body.name });

    if (deliverySubZoneDB) {
      return res.status(400).json({
        msg: `La zona ${deliverySubZoneDB.name}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const deliverySubZone = new DeliverySubZone(data);

    // Guardar DB
    await deliverySubZone.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliverySubZone,
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

const putDeliverySubZone = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const deliverySubZone = await DeliverySubZone.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        deliverySubZone,
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

const deleteDeliverySubZone = async (req, res = response) => {
  try {
    const { id } = req.params;
    await DeliverySubZone.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postDeliverySubZone,
  getDeliverySubZones,
  getDeliverySubZone,
  putDeliverySubZone,
  deleteDeliverySubZone,
};

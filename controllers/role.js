const { response } = require("express");
const { Role } = require("../models");

const getRoles = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, roles] = await Promise.all([
      Role.countDocuments(query),
      Role.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        roles,
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

const getRole = async (req, res = response) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        role,
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

const postRole = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const roleDB = await Role.findOne({ role: body.role });

    if (roleDB) {
      return res.status(400).json({
        msg: `La zona ${roleDB.role}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const role = new Role(data);

    // Guardar DB
    await role.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        role,
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

const putRole = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const role = await Role.findByIdAndUpdate(id, data, { new: true });

    

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        role,
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

const deleteRole = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Role.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postRole,
  getRoles,
  getRole,
  putRole,
  deleteRole,
};

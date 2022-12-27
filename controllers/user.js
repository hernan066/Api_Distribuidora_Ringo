const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers");
const { User } = require("../models");

const getUsers = async (req = request, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('role', 'role')
    ]);
    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        total,
        users,
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

const getUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        user,
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

const postUser = async (req, res = response) => {
  try {
    const { state, password, ...body } = req.body;

    const salt = bcryptjs.genSaltSync();
    newPassword = bcryptjs.hashSync(password, salt);

    const data = {
      ...body,
      password: newPassword,
    };

    const user = new User(data);

    // Guardar en BD
    await user.save();

    const token = await generarJWT(user.id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        user,
        token,
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

const putUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        user,
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
const patchUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        user,
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

const deleteUser = async (req, res = response) => {

  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { state: false });
  
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
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  patchUser
};

const { response } = require("express");
const { Employee } = require("../models");

const getEmployees = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query;
    const query = { state: true };

    const [total, employees] = await Promise.all([
      Employee.countDocuments(query),
      Employee.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        employees,
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

const getEmployee = async (req, res = response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        employee,
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

const postEmployee = async (req, res = response) => {
  try {
    const { state, ...body } = req.body;

    const employeeDB = await Employee.findOne({ cuil: body.cuil });

     if (employeeDB) {
      return res.status(400).json({
        msg: `El CUIL ${employeeDB.cuil}, ya existe`,
      });
    } 

    // Generar la data a guardar
    const data = {
      ...body,
    };

    const employee = new Employee(data);

    // Guardar DB
    await employee.save();

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        employee,
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

const putEmployee = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        employee,
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

const deleteEmployee = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndUpdate(id, { state: false }, { new: true });

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
  postEmployee,
  getEmployees,
  getEmployee,
  putEmployee,
  deleteEmployee,
};

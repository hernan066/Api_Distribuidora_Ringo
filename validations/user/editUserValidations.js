const { check } = require("express-validator");
const { existUserById, isValidRol } = require("../../helpers");
const { validateFields } = require("../../middlewares");

const editUserValidations = [
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(existUserById),
  check("rol").custom(isValidRol),
  validateFields,
];

module.exports = {
    editUserValidations,
};

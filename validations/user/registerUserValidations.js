const { check } = require("express-validator");
const { emailExist, phoneExist, isValidRol } = require("../../helpers");
const { validateFields } = require("../../middlewares");

const registerUserValidations = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("lastName", "El nombre es obligatorio").not().isEmpty(),
  check("password", "El password debe de ser más de 6 letras").isLength({
    min: 6,
  }),
  check("email", "El email no es válido").isEmail(),
  check("email").custom(emailExist),
  check("phone", "El teléfono es obligatorio").not().isEmpty(),
  check("phone", "Solo números").isNumeric(),
  check("phone").custom(phoneExist),
  check("rol").custom(isValidRol),
  validateFields,
];

module.exports = {
    registerUserValidations,
};

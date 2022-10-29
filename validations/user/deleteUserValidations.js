const { check } = require("express-validator");
const { existUserById, isValidRol } = require("../../helpers");
const { validateFields, validarJWT, tieneRole } = require("../../middlewares");

const deleteUserValidations = [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    validateFields
];

module.exports = {
    deleteUserValidations,
};
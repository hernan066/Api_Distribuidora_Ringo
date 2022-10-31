const { validateFields, validarJWT, esAdminRole } = require("../middlewares");
const { check } = require('express-validator');
const {  existProductById, existCategoryById } = require("../helpers");

const getProductValidator = [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields,
]
const postProductValidator = [
    validarJWT,
    check('name','[name] es obligatorio').not().isEmpty(),
    check('category','No es un id de Mongo').isMongoId(),
    check('category').custom( existCategoryById ),
    validateFields
]
const putProductValidator = [
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
]
const deleteProductValidator = [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields,
]

module.exports = {
    getProductValidator,
    postProductValidator,
    putProductValidator,
    deleteProductValidator
}

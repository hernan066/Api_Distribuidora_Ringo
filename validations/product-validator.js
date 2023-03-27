const { validateFields, validarJWT, isAdminRole } = require("../middlewares");
const { check } = require('express-validator');
const {  existProductById, existCategoryById } = require("../helpers");

const getProductValidator = [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields,
]
const postProductValidator = [
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('brand','La marca es obligatoria').not().isEmpty(),
    check('unit','La unidad es obligatoria').not().isEmpty(),
    check('type','El tipo es obligatorio').not().isEmpty(),
/*     check('description','La descripción es obligatoria').not().isEmpty(), */
    check('category','No es un id de Mongo').isMongoId(),
    check('category').custom( existCategoryById ),
    validateFields
]
const putProductValidator = [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
]
const deleteProductValidator = [
    validarJWT,
    isAdminRole,
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
/* TODO validar init y type */

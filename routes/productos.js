const {
    getProductValidator,
    postProductValidator,
    putProductValidator,
    deleteProductValidator,
} = require("../validations/product-validator");
const {
    getProduct,
    getProducts,
    postProduct,
    putProduct,
    deleteProduct,
} = require("../controllers/productos");
const { Router } = require("express");
const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);
router.post("/", postProductValidator, postProduct);

// Actualizar - privado - cualquiera con token válido
router.put("/:id", putProductValidator, putProduct);

// Borrar un producto - Admin
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;

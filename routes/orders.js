const { Router } = require("express");
const { getAllorders, getAllordersByNumber, postNewOrder } = require("../controllers/orders");
const { validarCampos } = require("../middlewares");
const { validarUsuarioWhatsapp } = require("../middlewares/validar-usuario-whatsapp");

const router = Router();

// /api/orders?limit=20&init=10
router.get("/", getAllorders);
router.post("/",[validarUsuarioWhatsapp, validarCampos], postNewOrder);

router.get("/:number",  getAllordersByNumber);

module.exports = router;

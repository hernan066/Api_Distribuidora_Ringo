const { Router } = require("express");
const { getAllorders, getAllordersByNumber, postNewOrder } = require("../controllers/orders");
const { validateFields } = require("../middlewares");
const { validarUsuarioWhatsapp } = require("../middlewares/validar-usuario-whatsapp");

const router = Router();

// /api/orders?limit=20&init=10
router.get("/", getAllorders);

router.get("/:id",  getAllordersByNumber);

router.post("/",[validarUsuarioWhatsapp, validateFields], postNewOrder);

router.put("/:id",[validarUsuarioWhatsapp, validateFields], postNewOrder);

router.delete("/:id",[validarUsuarioWhatsapp, validateFields], postNewOrder);


module.exports = router;

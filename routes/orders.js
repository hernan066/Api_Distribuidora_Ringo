const { Router } = require("express");
const {  getOrders, postOrder, putOrder, deleteOrder, getOrder, getUserOrder } = require("../controllers/orders");
const { postOrderValidator, getOrderValidator, putOrderValidator, deleteOrderValidator, getOrderUserValidator } = require("../validations/order-validator");

const router = Router();

// /api/orders?limit=20&init=10
/* router.get("/", getAllorders);

router.get("/:id",  getAllordersByNumber);

router.post("/",[validarUsuarioWhatsapp, validateFields], postNewOrder);

router.put("/:id",[validarUsuarioWhatsapp, validateFields], postNewOrder);

router.delete("/:id",[validarUsuarioWhatsapp, validateFields], postNewOrder); */
router.get("/", getOrders);

router.get("/:id", getOrderValidator , getOrder);
router.get("/user/:id", getOrderUserValidator , getUserOrder);

router.post("/", postOrderValidator, postOrder);

router.put("/:id", putOrderValidator, putOrder);

router.delete("/:id",deleteOrderValidator, deleteOrder);


module.exports = router;

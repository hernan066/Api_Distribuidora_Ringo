const { Router } = require("express");
const { reportTotalOrdersByMonth, reportTotalOrdersByDay, reportTotalOrdersProducts, reportNewClientByMonth, reportTotalOrders, reportTotalOrdersProductsByDay } = require("../controllers/report");


const router = Router();

// /api/reports

router.get("/ordersByMonth", reportTotalOrdersByMonth);
router.get("/ordersByDay", reportTotalOrdersByDay);
router.get("/orders", reportTotalOrders);

router.get("/totalOrderProducts", reportTotalOrdersProducts);
router.get("/totalOrderProductsByDay", reportTotalOrdersProductsByDay);

router.get("/newClientByMonth", reportNewClientByMonth);



module.exports = router;

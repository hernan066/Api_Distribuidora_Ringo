const { Router } = require("express");
const { reportTotalOrdersByMonth, reportTotalOrdersByDay, reportTotalOrdersProducts, reportNewClientByMonth, reportTotalOrders, reportTotalOrdersProductsByDay, reportTotalOrdersProductsByRange, reportTotalOrdersProductsByRangeTest, reportPaymentByRangeDay } = require("../controllers/report");


const router = Router();

// /api/reports

router.get("/ordersByMonth", reportTotalOrdersByMonth);
router.get("/ordersByDay", reportTotalOrdersByDay);
router.get("/orders", reportTotalOrders);

router.get("/totalOrderProducts", reportTotalOrdersProducts);
router.get("/totalOrderProductsByDay", reportTotalOrdersProductsByDay);
router.get("/totalOrderProductsByRange", reportTotalOrdersProductsByRange);
router.post("/totalOrderProductsByRangeTest", reportTotalOrdersProductsByRangeTest);

router.get("/newClientByMonth", reportNewClientByMonth);

router.post("/reportPaymentByRangeDay", reportPaymentByRangeDay);



module.exports = router;

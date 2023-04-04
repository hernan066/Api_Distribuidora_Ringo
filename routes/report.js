const { Router } = require("express");
const { reportTotalOrdersByMonth, reportTotalOrdersByDay, reportTotalOrdersProducts, reportNewClientByMonth, reportTotalOrders, reportTotalOrdersProductsByDay, reportTotalOrdersProductsByRange, reportTotalOrdersProductsByRangeTest, reportPaymentByRangeDay, reportTotalSellByRangeDay, reportTotalOrders21_03 } = require("../controllers/report");


const router = Router();

// /api/reports

router.get("/ordersByMonth", reportTotalOrdersByMonth);
router.get("/ordersByDay", reportTotalOrdersByDay);
router.get("/orders", reportTotalOrders);

router.get("/totalOrderProducts", reportTotalOrdersProducts);
router.get("/totalOrderProducts21_03", reportTotalOrders21_03);

router.get("/totalOrderProductsByDay", reportTotalOrdersProductsByDay);
router.get("/totalOrderProductsByRange", reportTotalOrdersProductsByRange);
router.post("/totalOrderProductsByRangeTest", reportTotalOrdersProductsByRangeTest);

router.get("/newClientByMonth", reportNewClientByMonth);

router.post("/reportPaymentByRangeDay", reportPaymentByRangeDay);
router.post("/reportTotalSellByRangeDay", reportTotalSellByRangeDay);



module.exports = router;

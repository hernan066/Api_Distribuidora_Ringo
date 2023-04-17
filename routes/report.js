const { Router } = require("express");
const { reportTotalOrdersByMonth, reportTotalOrdersByDay, reportTotalOrdersProducts, reportNewClientByMonth, reportTotalOrders, reportTotalOrdersProductsByDay, reportTotalOrdersProductsByRange, reportTotalOrdersProductsByRangeTest, reportPaymentByRangeDay, reportTotalSellByRangeDay, reportTotalOrders21_03, reportTotalStock, reportTotalClientDebt, reportTotalClientBuy, reportTotalClientBuyByRangeDays, reportTotalClientBuyAll, reportTotalClientBuyIndividual, reportTotalClientBuyIndividualByDay } = require("../controllers/report");


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

//stock
router.get("/reportTotalStock", reportTotalStock);
//clients
router.get("/reportTotalClientDebt", reportTotalClientDebt);
router.get("/reportTotalClientBuy", reportTotalClientBuyAll); // from 21/03/2023
router.get("/reportTotalClientBuy/:id", reportTotalClientBuyIndividual); // from 21/03/2023
router.post("/reportTotalClientBuyByRangeDays", reportTotalClientBuyByRangeDays);
router.get("/reportTotalClientBuyByDay/:id", reportTotalClientBuyIndividualByDay);



module.exports = router;

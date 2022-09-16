const { Router } = require("express");
const { getAllorders, getAllordersByNumber } = require("../controllers/orders");

const router = Router();

// /api/orders?limit=20&init=10
router.get("/", getAllorders);

router.get("/:number", getAllordersByNumber);

module.exports = router;

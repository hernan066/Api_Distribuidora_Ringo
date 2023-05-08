const { Router } = require("express");
const {
  getAllPoints,
  getAllPointsByClient,
  postPoints,
  putPoints,
  deletePoints,
} = require("../controllers/points");
const {
  getAllPointsValidation,
  getAllPointsByClientValidation,
  postPointsValidation,
  putPointsValidation,
  deletePointsValidation,
} = require("../validations/points-validator");

const router = Router();

/**
 * {{url}}/api/points
 */

router.get("/", getAllPointsValidation, getAllPoints);

router.get("/client/:id", getAllPointsByClientValidation, getAllPointsByClient);
router.post("/", postPointsValidation, postPoints);
router.put("/:id", putPointsValidation, putPoints);
router.delete("/:id", deletePointsValidation, deletePoints);

module.exports = router;

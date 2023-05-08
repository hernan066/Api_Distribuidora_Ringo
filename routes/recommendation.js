const { Router } = require("express");

const { getAllRecommendationValidation, getAllRecommendationByClientValidation, postRecommendationValidation, putRecommendationValidation, deleteRecommendationValidation } = require("../validations/recommendation-validator");
const { getAllRecommendation, getAllRecommendationByClient, postRecommendation, deleteRecommendation } = require("../controllers/recommendation");

const router = Router();

/**
 * {{url}}/api/recommendation
 */

router.get("/", getAllRecommendationValidation, getAllRecommendation);

router.get("/client/:id", /* getAllRecommendationByClientValidation, */ getAllRecommendationByClient);
router.post("/", postRecommendationValidation, postRecommendation);
router.put("/:id", putRecommendationValidation, postRecommendation);
router.delete("/:id", deleteRecommendationValidation, deleteRecommendation);

module.exports = router;

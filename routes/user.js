const { Router } = require("express");
const {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  getUserVerify,
} = require("../controllers/user");
const {
  getUserValidations,
  postUserValidations,
  putUserValidations,
  deleteUserValidations,
  getUsersValidations,
} = require("../validations/user-validator");

const router = Router();

//publico
router.post("/", postUserValidations, postUser);
//privado
router.get("/:id", getUserValidations, getUser);
router.patch("/:id", putUserValidations, putUser);
//admin
router.get("/", /* getUsersValidations, */ getUsers);
router.put("/:id", putUserValidations, putUser);
router.delete("/:id", deleteUserValidations, deleteUser);
//verify
router.get("/verify/:token",  getUserVerify);

module.exports = router;

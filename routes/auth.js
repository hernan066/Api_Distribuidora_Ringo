const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validar-campos");
const {
  googleSignin,
  loginRepartidor,
  loginAdmin,
  refresh,
  logout,
  loginUser,
} = require("../controllers/auth");
const { loginValidator } = require("../validations/auth/loginValidator");

const router = Router();

router.post("/login", loginValidator, loginUser);

router.post(
  "/login_repartidor",
  [
    check("patente", "El correo es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  loginRepartidor
);

router.post(
  "/google",
  [
    check("id_token", "El id_token es necesario").not().isEmpty(),
    validateFields,
  ],
  googleSignin
);

//nuevo sistema de login para el dashboard
router.post("/login2", loginValidator, loginAdmin);
router.get("/refresh", refresh);
router.get("/logout2", logout);

module.exports = router;

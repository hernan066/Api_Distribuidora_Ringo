const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateFields,
  validarJWT,
  isAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  esRoleValido,

  existeRepartidorPorId,
  patenteExiste,
} = require("../helpers/db-validators");

const {
  repartidoresGet,
  repartidoresPut,
  repartidoresPost,
  //repartidoresDelete,
  //repartidoresPatch,
} = require("../controllers/repartidores");

const router = Router();

router.get("/", repartidoresGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeRepartidorPorId),
    validateFields,
  ],
  repartidoresPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("patente", "La patente es obligatoria").not().isEmpty(),
    check("patente").custom(patenteExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check("rol").custom(esRoleValido),
    validateFields,
  ],
  repartidoresPost
);

/* router.delete(
  "/:id",
  [
    validarJWT,
    // isAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAR_ROLE", "OTRO_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeRepartidorPorId),
    validateFields,
  ],
  repartidoresDelete
);

router.patch("/", repartidoresPatch); */

module.exports = router;

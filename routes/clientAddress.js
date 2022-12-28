const { Router } = require("express");
const {
  getClientAddresses,
  getClientAddress,
  postClientAddress,
  putClientAddress,
  deleteClientAddress,
} = require("../controllers/clientAddress");
const { validarJWT } = require("../middlewares");
const {
  getClientAddressValidator,
  postClientAddressValidator,
  putClientAddressValidator,
  deleteClientAddressValidator,
} = require("../validations/clientAddress-validator");

const router = Router();

/**
 * {{url}}/api/clients_address
 */

router.get("/", validarJWT, getClientAddresses);

router.get("/:id", getClientAddressValidator, getClientAddress);

router.post("/", postClientAddressValidator, postClientAddress);

router.put("/:id", putClientAddressValidator, putClientAddress);

router.delete("/:id", deleteClientAddressValidator, deleteClientAddress);

module.exports = router;

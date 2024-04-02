const express = require("express");
const {
  registerUser,
  getSingleUser,
  getUserByEmail,
  investMoney,
  totalReturn,
} = require("../controler/userControler");

const router = express.Router();

router.post("/register", registerUser);
router.get("/singleByEmail/:email", getSingleUser);
router.get("/peruser", getUserByEmail);
router.get("/investment/:email", investMoney);
router.get("/return/:email", totalReturn);

module.exports = router;

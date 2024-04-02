const express = require("express");
const {
  depositOrder,
  getAllDepositOrders,
  getDepositOrdersByUserEmail,
  updateDepositOrder,
  updateDepositOrderc,
  withdrawal,
  getAllWithdrawalOrders,
  getOrderToken,
  getPaymentStatus,
  getAllOrderToken,
} = require("../controler/orderControler");

const router = express.Router();
router.post("/deposit-create", depositOrder);
router.get("/deposit-orders", getAllDepositOrders);
router.get("/deposit-orders/:email", getDepositOrdersByUserEmail);
router.patch("/update-order/:id/", updateDepositOrder);
router.patch("/update-orderc/:id/", updateDepositOrderc);
router.get("/withdraw-orders", getAllWithdrawalOrders);
router.get("/get-all-order", getAllOrderToken);
router.post("/request-orders/:email", getOrderToken);
router.post("/all-orders/:email", getOrderToken);
router.post("/payment-status/:id", getPaymentStatus);

router.post("/withdraw", withdrawal);
module.exports = router;

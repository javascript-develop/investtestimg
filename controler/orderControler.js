const { default: mongoose } = require("mongoose");
const OrderDB = require("../modal/orderModal");
const User = require("../modal/userModal");
const WithdrawDB = require("../modal/withModal");
const axios = require("axios");
exports.depositOrder = async (req, res) => {
  try {
    // Extract deposit data from the request body
    const { plan, depositAmount, depositMethod, email } = req.body;
    console.log(req.body);
    // Validate the required fields
    if (!plan || !depositAmount || !depositMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create a new deposit order using the OrderDB model
    const newDepositOrder = new OrderDB({
      plan,
      depositAmount,
      depositMethod,
      email,
      status: "pending",
    });
    const membershipExpiration = new Date();
    membershipExpiration.setDate(
      membershipExpiration.getDate() + plan.duration
    );
    const savedDepositOrder = await newDepositOrder.save();
    if (savedDepositOrder) {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          plan: plan,
          membershipExpiration,
        },
        { new: true }
      );
    }
    res.status(201).json({
      success: true,
      message: "Deposit order created successfully",
      deposit: savedDepositOrder,
    });
  } catch (error) {
    console.error("Error creating deposit order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllDepositOrders = async (req, res) => {
  try {
    const deposits = await OrderDB.find();
    res.status(200).json({ success: true, deposits });
  } catch (error) {
    console.error("Error fetching all deposit orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getDepositOrdersByUserEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const deposits = await OrderDB.find({ email: userEmail });
    res.status(200).json({ success: true, deposits });
  } catch (error) {
    console.error("Error fetching deposit orders by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateDepositOrder = async (req, res) => {
  try {
    const { depositId } = req.body; // Assuming you are passing depositId in the request body

    const deposit = await OrderDB.findOneAndUpdate(
      { _id: depositId },
      { status: "Rejected" },
      { new: true, upsert: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      data: deposit,
      message: "Deposit updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDepositOrderc = async (req, res) => {
  try {
    const { depositId } = req.body; // Assuming you are passing depositId in the request body

    const deposit = await OrderDB.findOneAndUpdate(
      { _id: depositId },
      { status: "Complete" },
      { new: true, upsert: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      data: deposit,
      message: "Deposit updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.withdrawal = async (req, res) => {
  const { userEmail, withdrawalAmount, withdrawalMethod, withdrawalAddress } =
    req.body;

  try {
    // Create a new withdrawal request
    const withdrawal = new WithdrawDB({
      userEmail,
      withdrawalAmount,
      withdrawalMethod,
      withdrawalAddress,
      status: "Pending",
    });
    await withdrawal.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted successfully.",
    });
  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.getAllWithdrawalOrders = async (req, res) => {
  try {
    const withdraw = await WithdrawDB.find();
    res.status(200).json({ success: true, withdraw });
  } catch (error) {
    console.error("Error fetching all deposit orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getWithdrawOrdersByUserEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const withdraw = await WithdrawDB.find({ email: userEmail });
    res.status(200).json({ success: true, withdraw });
  } catch (error) {
    console.error("Error fetching deposit orders by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const paymentSchema = new mongoose.Schema({
  userEmail: String,
  orderData: Object,
});

const Payment = mongoose.model("payment", paymentSchema);

exports.getOrderToken = async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log(req.body, userEmail, "body");
    const body = req.body;
    const apiKey = "50JC1YP-CP3M2QC-N7TXMAB-GY2HG3B";

    const url = "https://api.nowpayments.io/v1/payment";

    const data = {
      price_amount: body.amount,
      price_currency: "usd",
      pay_currency: body.depositMethod,
      ipn_callback_url: "https://nowpayments.io",
      order_id: "P-343",
      order_description: "Apple Macbook Pro 2019 x 1",
    };

    const response = await axios.post(url, data, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    // Save the response to MongoDB
    const order = new Payment({
      userEmail: userEmail,
      orderData: response.data,
    });
    await order.save();

    // Sending back a response
    const responseData = {
      success: true,
      data: response.data,
      message: "Successfully fetched order token",
      userEmail: userEmail,
    };

    // Send the response back to the client
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching deposit orders by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getPaymentStatus = async (req, res) => {
  const id = req.params.id;
  console.log(id, "dffffffffffffffffffffffffffffffff");
  try {
    const apiKey = "50JC1YP-CP3M2QC-N7TXMAB-GY2HG3B";

    const url = `https://api.nowpayments.io/v1/payment/${id}`;

    const response = await axios.post(url, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    // Save the response to MongoDB

    // Sending back a response
    const responseData = {
      success: true,
      data: response.data,
      message: "Successfully fetched order token",
    };

    // Send the response back to the client
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching deposit orders by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllOrderToken = async (req, res) => {
  try {
    const id = req.params.id;
    const apiKey = "50JC1YP-CP3M2QC-N7TXMAB-GY2HG3B";

    const url = `https://api.nowpayments.io/v1/payment/?limit=10&page=0&sortBy=created_at&orderBy=asc`;

    const response = await axios.get(url, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    // Save the response to MongoDB

    // Sending back a response
    const responseData = {
      success: true,
      data: response.data,
      message: "Successfully fetched order token",
      userEmail: userEmail,
    };

    // Send the response back to the client
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching deposit orders by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

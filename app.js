const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.set("port", 5003);
app.use(express.json());
const errorHandeler = require("./utilities/errorhendaler");
const userRouter = require("./router/user");
const orderRouter = require("./router/order");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
const cron = require("node-cron");
const User = require("./modal/userModal");
app.use("/", (req, res) => {
  res.send("hellw world");
});
cron.schedule("0 0 * * *", async () => {
  try {
    // Find all users with an active plan
    const users = await User.find({
      plan: { $exists: true },
      membershipExpiration: { $gte: new Date() },
    });

    // Iterate over each user and add profit to their wallets
    users.forEach(async (user) => {
      const plan = user.plan;
      const profitPerDay = plan.profit || 0; // Get profit per day from user's plan or default to 0
      user.wallet += profitPerDay; // Add profit to user's wallet
      await user.save(); // Save the updated user object
    });

    console.log("Daily profit added to users wallets.");
  } catch (error) {
    console.error("Error adding daily profit to users wallets:", error);
  }
});
app.use(errorHandeler);

module.exports = app;

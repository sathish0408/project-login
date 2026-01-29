const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// mongodb connection
mongoose.connect("mongodb://127.0.0.1:27017/mernLogin")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

// model
const User = mongoose.model("User", UserSchema);

// 🔴 UPDATED LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔹 check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  // 🔹 check password
  if (user.password !== password) {
    return res.json({ message: "Wrong password" });
  }

  // 🔹 success
  res.json({ message: "Login successful" });
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

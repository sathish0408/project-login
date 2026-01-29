const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// mongodb connection
mongoose.connect(process.env.MONGO_URL)
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
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
  
    const newUser = new User({ email, password });
    await newUser.save();
  
    res.json({ message: "User registered successfully" });
  });
  

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


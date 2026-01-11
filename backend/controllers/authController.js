const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or Mobile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGOUT ✅
exports.logout = async (req, res) => {
  try {
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

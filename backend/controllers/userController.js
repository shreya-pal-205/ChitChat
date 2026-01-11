const User = require("../models/User");







// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




  // VIEW OWN PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





//  EDIT OWN PROFILE
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, mobile },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






//  DELETE OWN PROFILE
exports.deleteMyProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "Account deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

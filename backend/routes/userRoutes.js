const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllUsers
} = require("../controllers/userController");

//Own profile routes
router.get("/", auth, getAllUsers);
router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);
router.delete("/me", auth, deleteMyProfile);

module.exports = router;

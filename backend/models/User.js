const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String
    },
    provider: {
      type: String,
      default: "local" // google, facebook, linkedin
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

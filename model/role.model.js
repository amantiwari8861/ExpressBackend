const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["ROLE_ADMIN", "ROLE_USER", "ROLE_INSTRUCTOR"],
    default: "ROLE_USER",
    required: true,
    unique: true,
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;

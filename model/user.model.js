const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,

    gender: { type: String, enum: ["male", "female", "other"] },

    skills: [String],

    age: { type: Number, min: 18 },

    isMemActive: { type: Boolean, default: false },

    dob: Date,

    salary: mongoose.Schema.Types.Decimal128,

    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

    others: { type: Map, of: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

const User = new mongoose.model("user", userSchema);
module.exports = User;

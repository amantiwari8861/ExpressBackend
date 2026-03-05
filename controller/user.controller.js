const User = require("../model/user.model");
const { getRoleId } = require("./loadUserRole");
const bcrypt = require("bcryptjs");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roleId");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch users", error: error.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("roleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Invalid user id", error: error.message });
  }
};

// SAVE user
exports.saveUser = async (u) => {
  try {
    const user = new User(u);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw new Error("unable to save user in db!");
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unable to update user", error: error.message });
  }
};

// DELETE user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Unable to delete user", error: error.message });
  }
};

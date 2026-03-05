const { sendEmail } = require("../config/mailer");
const User = require("../model/user.model");
const { getRoleId } = require("./loadUserRole");
const { saveUser } = require("./user.controller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (principle) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign(principle, JWT_SECRET, { expiresIn: "1hr" });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const userInDb = await User.findOne({ email: email });
    if (!userInDb) return res.status(404).send("Account doesn't exist!");
    console.log("user in db ", userInDb);

    if (bcrypt.compareSync(password, userInDb.password)) {
      const token = generateToken({
        email,
        name: userInDb.name,
        role: "ROLE_USER",
      });
      console.log(token);
      res.cookie("token", token, {
        httpOnly: true, // Prevent JS access (security)
        secure: false, // true in production (HTTPS)
        sameSite: "lax", // CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(202).send({ token: token });
    } else {
      res.status(400).send({ cause: "invalid credentials!" });
    }
  } catch (error) {
    res.status(500).send({ message: "unable to login", cause: error.message });
  }
};
exports.registerUser = async (req, res) => {
  try {
    let u = req.body;
    u.roleId = getRoleId("ROLE_USER");
    u.password = bcrypt.hashSync(u.password);
    console.log(u.password);
    const savedUser = await saveUser(u);
    await sendEmail({
      to: savedUser.email,
      subject: "Welcome to My App",
      templateName: "welcome",
      data: {
        name: savedUser.name,
        appName: "My App",
        actionUrl: "http://localhost:5000/login",
        year: new Date().getFullYear(),
      },
    });
    res.status(201).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to save User", error: error.message });
  }
};
exports.registerInstructor = async (req, res) => {};

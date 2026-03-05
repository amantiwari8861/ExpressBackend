const {
  loginUser,
  registerUser,
  registerInstructor,
} = require("../controller/auth.controller");

const authRouter = require("express").Router();

authRouter.post("/user/login", loginUser);
authRouter.post("/user/register", registerUser);
authRouter.post("/instructor/register", registerInstructor);

module.exports = authRouter;

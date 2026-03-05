const formRouter = require("express").Router();

formRouter.post("/submit", (req, res) => {
  const { username, email } = req.body;

  console.log("Username:", username);
  console.log("Email:", email);

  res.send("Form data received successfully!");
});
module.exports = formRouter;

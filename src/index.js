require("dotenv").config({ quiet: true });

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("../router/user.router");
const uploadRoute = require("../router/upload.router.js");
const formRouter = require("../router/form.router");
const { loadRoles, getRoleId } = require("../controller/loadUserRole");
const Role = require("../model/role.model");
const authRouter = require("../router/auth.router");
const corsOptions = require("../config/cors.config");
const emailRoutes = require("../router/email.routes.js");
const { verifyMailer } = require("../config/mailer.js");
const aiRouter = require("../router/openai.routes.js");

// const authMiddleware = require("../middlewares/router_level/auth.middleware");
const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", aiRouter);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// app.use(authMiddleware);// Application level Middleware

app.get("/", (req, res) => {
  // console.log(req.meraNaam);

  res.send("server is up and running!");
});

app.use(authRouter);
app.use(formRouter);
app.use(uploadRoute);
app.use("/api/email", emailRoutes);

app.use("/api/v1/users", router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB connected");

    await loadRoles(); // load roles once at startup

    app.listen(PORT, HOST, () => {
      console.log(`listening on http://${HOST}:${PORT}`);
    });
    await verifyMailer();
  })
  .catch((err) => console.error(err));
// https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/

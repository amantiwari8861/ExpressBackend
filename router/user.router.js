const { getAllUsers, getUserById, updateUser, deleteUserById } = require("../controller/user.controller");
const authMiddleware = require("../middlewares/router_level/auth.middleware");

const router = require("express").Router();

router.get("/greet", (req, res) => {
  res.send("Hello Aman Sir!");
});

router.use(authMiddleware); // Router Level Middleware

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

module.exports = router;

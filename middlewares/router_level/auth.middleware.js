const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log("Authenticating...");

    let token;

    console.log(req.headers);

    // 1️⃣ Check Authorization Header first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ If not found, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If still no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // 4️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach decoded user info
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;

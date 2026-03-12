const allowedOrigins = [
  "http://localhost:5000",
  "https://iamandroid.in",
  "http://iamandroid.in",
  "https://api.iamandroid.in",
  "https://www.api.iamandroid.in",
  "http://api.iamandroid.in",
  "http://localhost:5173", // dev only
  "http://localhost:3000", // dev only
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true, // Allow cookies / Authorization header

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],

  exposedHeaders: ["Authorization"],

  optionsSuccessStatus: 200, // for legacy browsers
};

module.exports = corsOptions;

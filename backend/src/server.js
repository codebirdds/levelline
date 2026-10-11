const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Check database configuration
const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_PASSWORD",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(
    `❌ Missing environment variables: ${missingEnv.join(", ")}`
  );
  process.exit(1);
}

console.log("Database Host:", process.env.DB_HOST);
console.log("Database Port:", process.env.DB_PORT);
console.log("Database Name:", process.env.DB_NAME);
console.log("Database User: sujat");

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const db = require("./models");

const userRoutes = require("./routes/user_route.js");
const categoryRoute = require("./routes/category_route.js");
const productRoute = require("./routes/product_route.js");
const contactRoute = require("./routes/contact_route.js");

const logger = require("./middlewares/logger");
const notFound = require("./middlewares/notFoundHandler.js");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/contact", contactRoute);

app.use(notFound);
app.use(errorHandler);

// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected ✅");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error ❌", err);
    process.exit(1);
  });
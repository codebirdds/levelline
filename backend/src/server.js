
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

const db = require("./models");

const userRoutes = require("./routes/user_route.js");
const categoryRoute = require("./routes/category_route.js");
const productRoute = require("./routes/product_route.js");
const contactRoute = require("./routes/contact_route.js");
const cartRoute = require("./routes/cart_route.js");
const addressRoute = require("./routes/address_route.js");
const orderRoute = require("./routes/order_route.js");
const paymentRoute = require("./routes/payment_route.js");
const siteMediaRoute = require("./routes/site_media_route.js");

const logger = require("./middlewares/logger");
const notFound = require("./middlewares/notFoundHandler.js");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// CORS: Allow all origins with credentials
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    optionsSuccessStatus: 200,
  })
);

// Middleware
app.use(express.json());
app.use(logger);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/site-media", siteMediaRoute);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection and server startup
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected ✅");

    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Server timeout configuration
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 66_000;
    server.requestTimeout = 75_000;
  })
  .catch((err) => {
    console.error("DB connection error ❌", err);
    process.exit(1);
  });

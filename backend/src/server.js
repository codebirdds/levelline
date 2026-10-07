const express = require("express");
const cors = require("cors");
require("dotenv").config();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000', // Vite dev server default
      'http://localhost:5173', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

const db = require('./models'); // 👈 IMPORTANT FIX

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

// ✅ FIX HERE
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connected ✅");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection error ❌", err);
  });
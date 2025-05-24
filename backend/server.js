require("dotenv").config({ path: "./src/config/.env" });
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/database");
const { errorHandler } = require("./src/utils/errorHandler");
const { initializeAdmin } = require("./src/config/init");
const config = require("./src/config/config");
const path = require("path");
// Import routes
const checkoutRoutes = require("./src/routes/checkoutRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const promotionRoutes = require("./src/routes/promotionRoutes");
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const configRoutes = require("./src/routes/configRoutes");
const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, config.upload.path)));

// Initialize routes
app.use("/api/checkout", checkoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotions", promotionRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/config", configRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = config.server.port;

const startServer = async () => {
  try {
    // Initialize admin user
    await initializeAdmin();

    // Start server
    app.listen(PORT, () => {
      console.log(
        `Server running in ${config.server.env} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

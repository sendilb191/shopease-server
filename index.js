const express = require("express");
const cors = require("cors");
const { router: authRouter } = require("./auth");
const { initDB, getAllProducts, getProductById, addProduct } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDB();

// CORS configuration - must be FIRST
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-CSRF-Token",
      "X-Api-Version",
    ],
    credentials: true,
  })
);

// Handle OPTIONS preflight for all routes
app.options("*", cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Auth routes
app.use("/api/auth", authRouter);

// Get all products
app.get("/api/products", (req, res) => {
  const { search } = req.query;
  let filteredProducts = getAllProducts();

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Add new product
app.post("/api/products", (req, res) => {
  const { name, price } = req.body;

  // Validation
  if (!name || price === undefined) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  const newProduct = addProduct({ name, price });

  res.status(201).json(newProduct);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;

const express = require("express");
const cors = require("cors");
const { router: authRouter } = require("./auth");
const {
  initDB,
  getCart,
  saveCart,
  clearCart,
  getAllProducts,
  getProductById,
} = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDB();

// Request logging middleware - FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

// CORS - Handle preflight FIRST before anything else
app.use((req, res, next) => {
  console.log("[CORS] Setting headers for:", req.method, req.url);

  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, X-Api-Version"
  );

  // Handle preflight immediately
  if (req.method === "OPTIONS") {
    console.log("[CORS] Handling OPTIONS preflight, returning 204");
    return res.status(204).end();
  }

  console.log("[CORS] Continuing to next middleware");
  next();
});

app.use(express.json());

// Auth routes
app.use("/api/auth", authRouter);

// Get all products
app.get("/api/products", (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = getAllProducts();

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
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

// Get cart
app.get("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const cart = getCart(userId);
  res.json(cart);
});

// Add to cart
app.post("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const { productId, quantity = 1 } = req.body;

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = getCart(userId);

  const existingItem = cart.items.find(
    (item) => item.productId === parseInt(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: parseInt(productId),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  // Calculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(userId, cart);
  res.json(cart);
});

// Update cart item quantity
app.put("/api/cart/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  let cart = getCart(userId);

  const item = cart.items.find(
    (item) => item.productId === parseInt(productId)
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (item) => item.productId !== parseInt(productId)
    );
  } else {
    item.quantity = quantity;
  }

  // Recalculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(userId, cart);
  res.json(cart);
});

// Remove from cart
app.delete("/api/cart/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;

  let cart = getCart(userId);

  cart.items = cart.items.filter(
    (item) => item.productId !== parseInt(productId)
  );

  // Recalculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  saveCart(userId, cart);
  res.json(cart);
});

// Clear cart
app.delete("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const cart = clearCart(userId);
  res.json({ message: "Cart cleared", cart });
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

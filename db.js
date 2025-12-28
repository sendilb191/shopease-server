// In-memory database for Vercel serverless (read-only filesystem)
// For production, use a real database like MongoDB, PostgreSQL, etc.

let db = {
  users: [],
  carts: {},
  products: [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 99.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      category: "Electronics",
      stock: 50,
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health tracking",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      category: "Electronics",
      stock: 30,
    },
    {
      id: 3,
      name: "Running Shoes",
      description: "Comfortable running shoes for athletes",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      category: "Sports",
      stock: 100,
    },
    {
      id: 4,
      name: "Backpack",
      description: "Durable backpack for everyday use",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      category: "Accessories",
      stock: 75,
    },
    {
      id: 5,
      name: "Sunglasses",
      description: "Stylish sunglasses with UV protection",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300",
      category: "Accessories",
      stock: 200,
    },
    {
      id: 6,
      name: "Coffee Mug",
      description: "Insulated coffee mug keeps drinks hot",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300",
      category: "Home",
      stock: 150,
    },
  ],
};

// Initialize database structure
const initDB = () => {
  // Already initialized with default values above
  return db;
};

// Read database
const readDB = () => {
  return db;
};

// Write database (in-memory)
const writeDB = (data) => {
  db = data;
};

// User operations
const findUserByEmail = (email) => {
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

const findUserById = (id) => {
  return db.users.find((user) => user.id === id);
};

const createUser = (user) => {
  db.users.push(user);
  return user;
};

// Cart operations
const getCart = (userId) => {
  return db.carts[userId] || { items: [], total: 0 };
};

const saveCart = (userId, cart) => {
  db.carts[userId] = cart;
  return cart;
};

const clearCart = (userId) => {
  db.carts[userId] = { items: [], total: 0 };
  return db.carts[userId];
};

// Product operations
const getAllProducts = () => {
  return db.products;
};

const getProductById = (id) => {
  return db.products.find((product) => product.id === parseInt(id));
};

const getProductsByCategory = (category) => {
  return db.products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
};

const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return db.products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
  );
};

const addProduct = (product) => {
  const newId = Math.max(...db.products.map((p) => p.id), 0) + 1;
  const newProduct = { ...product, id: newId };
  db.products.push(newProduct);
  return newProduct;
};

const updateProduct = (id, updates) => {
  const index = db.products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...updates };
  return db.products[index];
};

const deleteProduct = (id) => {
  const index = db.products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return null;
  const deleted = db.products.splice(index, 1);
  return deleted[0];
};

module.exports = {
  initDB,
  readDB,
  writeDB,
  findUserByEmail,
  findUserById,
  createUser,
  getCart,
  saveCart,
  clearCart,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

// In-memory database for Vercel serverless (read-only filesystem)
// For production, use a real database like MongoDB, PostgreSQL, etc.

let db = {
  users: [],
  carts: {},
  products: [],
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
  const newProduct = {
    id: newId,
    name: product.name,
    price: product.price,
    addedTime: new Date().toISOString(),
  };
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

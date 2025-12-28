// In-memory database for Vercel serverless (read-only filesystem)
// For production, use a real database like MongoDB, PostgreSQL, etc.

let db = {
  users: [],
  carts: {},
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
};

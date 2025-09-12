const express = require('express'); 
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4000;

// Use db.json (auto-create if missing)
const DB_PATH = path.join(__dirname, 'db.json');

// --- Ensure db.json exists ---
if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    products: [
      {
        id: 1,
        name: "Coffee",
        description: "Hot brewed coffee",
        category: "Drinks",
        price: 20,
        quantity: 50
      },
      {
        id: 2,
        name: "Burger",
        description: "Beef burger with cheese",
        category: "Food",
        price: 60,
        quantity: 25
      }
    ],
    transactions: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  console.log("✅ db.json created with sample data.");
}

// --- Middleware ---
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// --- Helper functions ---
function readDB() {
  const raw = fs.readFileSync(DB_PATH);
  return JSON.parse(raw);
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- Routes ---

// Get all products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

// Add new product
app.post('/api/products', (req, res) => {
  const db = readDB();
  const product = req.body;
  product.id = Date.now();
  db.products = db.products || [];
  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  db.products = db.products || [];
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  writeDB(db);
  res.json(db.products[idx]);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  db.products = db.products || [];
  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Stock transactions (add/deduct stock)
app.post('/api/transactions', (req, res) => {
  const { productId, change, note } = req.body;
  const db = readDB();
  db.products = db.products || [];
  const idx = db.products.findIndex(p => p.id === productId);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products[idx].quantity = (db.products[idx].quantity || 0) + Number(change);

  db.transactions = db.transactions || [];  
  const tx = {
    id: Date.now(),
    productId,
    change: Number(change),
    note,
    date: new Date().toISOString()
  };
  db.transactions.push(tx);

  writeDB(db);
  res.json({ product: db.products[idx], tx });
});

// --- Start server ---
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);

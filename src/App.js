import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import Dashboard from "./Dashboard";
import RecordSalesForm from "./RecordSalesForm";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample sales data for charting
  const sampleSales = [
    { month: 'Jan', total: 12000 },
    { month: 'Feb', total: 15000 },
    { month: 'Mar', total: 10000 },
    { month: 'Apr', total: 18000 },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
       const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Debug fetch
    fetch("http://localhost:4000/api/products")
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => console.log("Fetched products (debug):", data))
        .catch(err => console.error("Fetch error (debug):", err));
  }, []);

  const handleProductAdded = (product) => setProducts([...products, product]);
  const handleProductDeleted = (id) => setProducts(products.filter(p => p.id !== id));
  const handleProductUpdated = (updatedProduct) =>
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));

  return (
    <div className="App">
      <h1>Wings Cafe Inventory System</h1>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <button onClick={fetchProducts} className="refresh-btn">🔄 Refresh Products</button>

          {/* 🗂️ Tab Buttons */}
          <div className="tabs">
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </button>
             <button
              className={activeTab === "add" ? "active" : ""}
              onClick={() => setActiveTab("add")}
            >
              ➕ Add Product
            </button>
            <button
              className={activeTab === "list" ? "active" : ""}
              onClick={() => setActiveTab("list")}
            >
              📋 Product List
            </button>
            <button
              className={activeTab === "sales" ? "active" : ""}
              onClick={() => setActiveTab("sales")}
            >
              🛒 Record Sale
            </button>
          </div>

          {/* 🧩 Tab Content */}
          {activeTab === "dashboard" && (
            <Dashboard products={products} sales={sampleSales} />
          )}
           {activeTab === "add" && (
            <ProductForm
              onProductAdded={handleProductAdded}
              editingProduct={editingProduct}
              onProductUpdated={handleProductUpdated}
              setEditingProduct={setEditingProduct}
            />
          )}
          {activeTab === "list" && (
            <ProductList
              products={products}
              onDelete={handleProductDeleted}
              setEditingProduct={setEditingProduct}
            />
          )}
          {activeTab === "sales" && <RecordSalesForm />}
            </>
      )}
    </div>
  );
}

export default App;

         
// src/ProductList.js
import React, { useState, useEffect } from "react";

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState({}); // Track input per product

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle input change for stock adjustment
  const handleInputChange = (id, value) => {
    setAdjustments((prev) => ({ ...prev, [id]: value }));
  };

  // Add or deduct stock
  const adjustStock = async (id, type) => {
    const amount = Number(adjustments[id]);
    if (!amount || amount <= 0) return alert("Enter a valid quantity");

    const endpoint =
      type === "add"
        ? "http://localhost:4000/inventory/add-stock"
        : "http://localhost:4000/inventory/deduct-stock";

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, amount }),
      });
      setAdjustments((prev) => ({ ...prev, [id]: "" }));
      fetchProducts();
    } catch (error) {
      console.error("Error adjusting stock:", error);
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
              <th>Adjust Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => onEdit(product)}>Update</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
                <td>
                  <input
                    type="number"
                    value={adjustments[product.id] || ""}
                    onChange={(e) => handleInputChange(product.id, e.target.value)}
                    placeholder="Qty"
                    style={{ width: "60px", marginRight: "5px" }}
                  />
                  <button onClick={() => adjustStock(product.id, "add")}>Add</button>
                  <button onClick={() => adjustStock(product.id, "deduct")}>Deduct</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;

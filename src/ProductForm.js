import React, { useState, useEffect } from "react";

function ProductForm({ onProductAdded, editingProduct, onProductUpdated, setEditingProduct }) {
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", quantity: "" });

  // Load editing product into form
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        price: editingProduct.price,
        quantity: editingProduct.quantity
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { 
      ...form, 
      price: parseFloat(form.price), 
      quantity: parseInt(form.quantity) 
    };

    if (editingProduct) {
      // Update product
      fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      })
      .then(res => res.json())
      .then(data => {
        onProductUpdated(data);
        setEditingProduct(null);
        setForm({ name: "", description: "", category: "", price: "", quantity: "" });
      })
      .catch(err => console.error(err));
    } else {
      // Add new product
      fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      })
      .then(res => res.json())
      .then(data => {
        onProductAdded(data);
        setForm({ name: "", description: "", category: "", price: "", quantity: "" });
      })
      .catch(err => console.error(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>{editingProduct ? "Update Product" : "Add Product"}</h2>
      <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required min="0" />
      <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required min="0" />
      <button type="submit">{editingProduct ? "Update" : "Add"}</button>
      {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setForm({ name: "", description: "", category: "", price: "", quantity: "" }) }}>Cancel</button>}
    </form>
  );
}

export default ProductForm;

import React, { useState, useEffect } from "react";

function SalesRecords() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch recorded sales
  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:4000/sales");
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Update total price
  useEffect(() => {
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (product) {
      setTotal(product.price * quantity);
    } else {
      setTotal(0);
    }
  }, [selectedProductId, quantity, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return alert("Select a valid product");

    const saleData = {
      items: [
        {
          productId: product.id,
          name: product.name,
          quantity: Number(quantity),
          price: product.price,
        },
      ],
    };

    try {
      const res = await fetch("http://localhost:4000/sales/record-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      const result = await res.json();
      if (result.success) {
        alert("Sale recorded successfully!");
        setSelectedProductId("");
        setQuantity(1);
        setTotal(0);
        fetchSales(); // Refresh sales list
      } else {
        alert(result.error || "Failed to record sale");
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Server error while recording sale");
    }
  };

  return (
    <div>
      <h2>Record Sale</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(Number(e.target.value))}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (M{p.price})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
          placeholder="Quantity"
        />

        <div style={{ fontWeight: "bold", alignSelf: "center" }}>
          Total: M{total}
        </div>

        <button type="submit">Record Sale</button>
      </form>

      <h2>Sales Records</h2>
      {sales.length === 0 ? (
        <p>No sales have been recorded yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price (M)</th>
              <th>Total (M)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) =>
              sale.items.map((item, idx) => (
                <tr key={`${sale.id}-${idx}`}>
                  <td>{sale.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>M{item.price}</td>
                  <td>M{item.price * item.quantity}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesRecords;

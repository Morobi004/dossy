import React from "react";
import SalesChart from "./SalesChart"; 

function Dashboard({ products, sales }) {
  // Inventory Stats
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockProducts = products.filter(p => p.quantity < 5);

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
      <h2>Dashboard</h2>

      {/* Inventory Overview */}
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div>
          <h3>Total Products</h3>
           <p>{totalProducts}</p>
        </div>
        <div>
          <h3>Total Quantity in Stock</h3>
          <p>{totalQuantity}</p>
        </div>
        <div>
          <h3>Low Stock Alerts</h3>
          {lowStockProducts.length > 0 ? (
            <ul>
              {lowStockProducts.map(p => (
                <li key={p.id}>
                  {p.name} (Qty: {p.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No products are low in stock.</p>
          )}
        </div>
      </div>

      {/* Sales Chart Section */}
      <div style={{ marginTop: "40px" }}>
        <SalesChart sales={sales} />
      </div>
 </div>
  );
}

export default Dashboard;


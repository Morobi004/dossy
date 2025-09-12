router.post('/record-sale', (req, res) => {
  const { items } = req.body;
  const products = readProducts();
  const sales = readSales(); // from sales.json

  let total = 0;
  const updatedProducts = [...products];

  for (const item of items) {
    const product = updatedProducts.find(p => p.id === item.productId);
    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
    }
    product.quantity -= item.quantity;
    total += item.price * item.quantity;
  }

  const newSale = {
    id: `sale${Date.now()}`,
    date: new Date().toISOString(),
    items,
    total
 };

  writeSales([...sales, newSale]);
  writeProducts(updatedProducts);

  res.json({ success: true, sale: newSale });
});


import { useEffect, useState } from 'react';
import axios from 'axios';

const SellerAllProducts = () => {
  const [products, setProducts] = useState([]);
  const backendUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  useEffect(() => {
    axios.get(`${backendUrl}/products/my`, { withCredentials: true })
      .then(res => setProducts(res.data.products || []))
      .catch(err => console.error("Failed to load products", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Your Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((prod) => (
            <li key={prod._id} className="border p-3 rounded">
              <p><strong>{prod.name}</strong> - ${prod.price}</p>
              <p className="text-sm text-gray-600">{prod.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerAllProducts;

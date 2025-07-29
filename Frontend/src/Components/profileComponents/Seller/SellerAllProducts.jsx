import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerAllProducts = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    axios.get(`${backendUrl}/products/seller/${user._id}`, {
      withCredentials: true,
    })
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(err => console.error("Failed to load products", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    try {console.log(productId)
      await axios.delete(`${backendUrl}/products/${productId}`, {
        withCredentials: true,
      });

      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Your Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading your products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((prod) => (
            <li key={prod._id} className="border p-4 rounded space-y-2">
              {prod.image && (
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-32 w-32 object-cover rounded"
                />
              )}
              <p className="text-lg font-semibold">{prod.name} - ${prod.price}</p>
              <p className="text-sm text-gray-700">{prod.description}</p>
              <p className="text-sm text-gray-600"><b>Stock:</b> {prod.stock}</p>
              <p className="text-sm text-gray-600"><b>Created:</b> {new Date(prod.createdAt).toLocaleString()}</p>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => navigate(`/dashboard/edit-product/${prod._id}`)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerAllProducts;

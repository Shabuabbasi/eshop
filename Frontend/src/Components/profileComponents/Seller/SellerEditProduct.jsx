import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SellerEditProduct = () => {
  const { id } = useParams(); // product ID
  const navigate = useNavigate();
  const backendUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${backendUrl}/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setProduct(p);
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          stock: p.stock || "",
          category: Array.isArray(p.category) ? p.category[0] : p.category || "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        alert("Could not load product.");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${backendUrl}/products/${id}`,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          category: [form.category], // Make sure it's an array
        },
        { withCredentials: true }
      );
      alert("Product updated successfully!");
      navigate("/dashboard/all-products");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default SellerEditProduct;

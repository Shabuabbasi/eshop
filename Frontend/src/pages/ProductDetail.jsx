import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cart from "../Images/exploreImages/cart.svg";

const ProductDetail = () => {
  const location = useLocation();
  const { id } = useParams(); // expecting /product/:id
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);

  // Fetch from backend if no product passed via state
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products/${id}`
          );
          setProduct(res.data.product);
        } catch (err) {
          setError("Product not found");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  if (loading) return <div className="p-10 text-lg">Loading...</div>;
  if (error || !product)
    return (
      <div className="p-10">
        <h2 className="text-2xl text-red-600">
          {error || "Product not found"}
        </h2>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          Go back
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg shadow"
        />

        {/* Product Info */}
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-xl text-gray-700 font-semibold mb-2">
            Rs {product.price}
          </p>
          <p className="text-gray-500 text-sm mb-1">Stock: {product.stock}</p>
          <p className="text-gray-500 text-sm mb-1">
            Seller: {product.seller?.name}
          </p>

          <div className="flex items-center mb-4 mt-2">
            <span className="text-yellow-400 text-lg mr-2">★</span>
            <span>{product.rating || 4.0} stars</span>
          </div>

          <p className="mb-6 text-gray-600">{product.description}</p>

          <button className="flex items-center bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            <img src={Cart} alt="Cart" className="w-5 h-5 mr-2" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

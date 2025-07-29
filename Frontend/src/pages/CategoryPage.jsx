import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cart from "../Images/exploreImages/cart.svg";
import { FiHeart } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products/all");
        if (res.data.success) {
          setProducts(res.data.products);
          const allCategories = res.data.products.flatMap((p) => p.category);
          const uniqueCategories = [...new Set(allCategories)];
          setCategories(uniqueCategories);
          console.log("Products fetched:", res.data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category.includes(selectedCategory));

  const renderStars = (rating = 4.0) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.19 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.784.57-1.838-.197-1.539-1.118l1.19-3.674a1 1 0 00-.364-1.118L2.321 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.19-3.674z" />
        </svg>
      );
    }

    if (half) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
        </svg>
      );
    }

    const empty = 5 - stars.length;
    for (let i = 0; i < empty; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 lg:px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Explore Products
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Sidebar: Category List */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded shadow sticky top-28">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Categories
            </h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${selectedCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  All
                </button>
              </li>
              {categories.map((cat, index) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-md transition ${selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content: Products Grid */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition relative"
              >
                {/* Favorite Icon */}
                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                  <FiHeart size={20} />
                </button>

                <Link
                  to={`/product/${encodeURIComponent(product.name)}`}
                  state={{ product }}
                >
                  <img
                    src={`${product.image}`}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 hover:underline">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mt-1">
                  Seller:{" "}
                  <span className="font-medium">{product.seller?.name}</span>
                </p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>

                <div className="flex items-center mt-2">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating || "4.0"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg text-gray-900">
                    Rs {product.price}
                  </span>
                  <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm">
                    <img src={Cart} alt="cart" className="w-4 h-4 mr-2" />
                    Add
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

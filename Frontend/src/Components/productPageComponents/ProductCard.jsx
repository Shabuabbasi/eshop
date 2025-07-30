import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import Cart from "../../Images/exploreImages/cart.svg";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  // State to manage favorite (heart) button
  const [isFavorited, setIsFavorited] = useState(false);

  // Handler for favorite button click: toggle true/false
  const toggleFavourite = () => {
    setIsFavorited((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 relative group">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={toggleFavourite}
          className={`p-1.5 rounded-full shadow-md transition ${
            isFavorited ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          <FiHeart size={18} color="white" />
        </button>
      </div>

      <Link
        to={`/product/${encodeURIComponent(product.name)}`}
        state={{ product }}
        className="block"
      >
        <div className="w-full h-44 overflow-hidden rounded-xl mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:underline line-clamp-1">
          {product.name}
        </h3>
      </Link>

      <p className="text-sm text-gray-600">
        Seller: <span className="font-medium">{product.seller?.name}</span>
      </p>
      <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>

      <div className="flex items-center justify-between mb-2">
        <StarRating rating={product.rating} />
        <span className="text-sm text-gray-500 ml-2">
          {product.rating || "4.0"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg text-blue-700">
          Rs {product.price}
        </span>
        <button className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium">
          <img src={Cart} alt="cart" className="w-4 h-4 mr-2" />
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

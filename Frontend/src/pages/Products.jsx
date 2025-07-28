import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../Components/Explore"; // Adjust if needed
import Cart from "../Images/exploreImages/cart.svg";
import { Heart } from "lucide-react";

const Products = () => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (index) => {
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const products = categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryPath: category.path,
      subCategoryPath: category.subPath,
    }))
  );

  const renderStars = (rating = 4) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    const fullStarPath =
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.19 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.784.57-1.838-.197-1.539-1.118l1.19-3.674a1 1 0 00-.364-1.118L2.321 9.101c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.19-3.674z";

    const halfStarPath =
      "M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0v15.27z";

    const stars = [];

    for (let i = 0; i < full; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={fullStarPath} />
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
          <path d={halfStarPath} />
        </svg>
      );
    }

    for (let i = 0; i < empty; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={fullStarPath} />
        </svg>
      );
    }

    return stars;
  };

  return (
    <section className="px-4 py-12 md:px-10 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            All Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Browse all categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Heart Icon */}
              <button
                onClick={() => toggleFavorite(index)}
                className="absolute top-3 right-3 z-10"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    favorites[index]
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>

              <Link
                to={`/category/${product.categoryPath}/${product.subCategoryPath}`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover p-4"
                />
              </Link>

              <div className="px-5 pb-5">
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.title}
                </h5>

                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating || 4)}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm ms-3">
                    {product.rating || "4.0"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.price || "$50"}
                  </span>
                  <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center">
                    <img src={Cart} alt="Cart" className="w-4 h-4 mr-2" />
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

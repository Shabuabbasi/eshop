import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  useEffect(() => {
    if (!user) return navigate('/login');
    if (user.role === 'Seller') setIsSeller(true);
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); // Adjust endpoint if needed
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCategorySelect = (e, categoryName) => {
    if (e.target.checked) {
      if (selectedCategories.length < 3) {
        setSelectedCategories((prev) => [...prev, categoryName]);
      }
    } else {
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat !== categoryName)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCategories.length < 1 || selectedCategories.length > 3) {
      alert('Please select between 1 and 3 categories.');
      return;
    }

    const productData = {
      ...formData,
      categories: selectedCategories,
    };

    console.log('Submitting item:', productData);
    alert('Item submitted successfully!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 pt-20">
      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl border-r border-gray-200 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-green-700 mb-10">Dashboard</h2>
        <nav className="space-y-5">
          <a href="#" className="block hover:text-blue-600 transition text-gray-800 font-medium">Overview</a>
          <a href="#" className="block hover:text-blue-600 transition text-gray-800 font-medium">Orders</a>
          <a href="#" className="block hover:text-blue-600 transition text-gray-800 font-medium">Profile</a>
          <a href="#" className="block hover:text-blue-600 transition text-gray-800 font-medium">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-0 md:ml-64 px-6 md:px-12 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">Welcome, {user.name}!</h1>
          <p className="text-gray-500 text-lg">Here's a quick overview of your account activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Orders</h2>
            <p className="text-4xl font-bold text-blue-600">124</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Pending Orders</h2>
            <p className="text-4xl font-bold text-yellow-500">5</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Spent</h2>
            <p className="text-4xl font-bold text-green-500">$2,450</p>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Information</h2>
          <ul className="space-y-2 text-gray-600">
            <li><strong>Account Type:</strong> {user.role}</li>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>

        {/* Seller Dashboard */}
        {isSeller && (
          <div className="bg-white shadow-xl rounded-xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Seller Dashboard</h2>
            <p className="text-gray-600 mb-6">Add a new product below:</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Category Checkbox Section */}
              <div>
                <label className="block font-semibold mb-2">Select up to 3 Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={cat.name}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={(e) => handleCategorySelect(e, cat.name)}
                        disabled={
                          !selectedCategories.includes(cat.name) &&
                          selectedCategories.length >= 3
                        }
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">Select at least 1 category.</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow"
              >
                Add Product
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile

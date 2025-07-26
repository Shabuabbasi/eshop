import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Navbar = ({ user, setUser }) => {
  const [count, setCount] = useState(4);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/users/logout`,  { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-lg shadow-sm text-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-wide hover:scale-105 transition">
            eShop
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Categories ▼
            </button>
            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 bg-white shadow-xl rounded-md w-52 border border-gray-200 z-50 animate-fade-in">
                {["Fashion", "Sports", "Gaming"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/product" className="text-sm hover:text-blue-600 font-medium transition">Shop</Link>
          <Link to="/contact" className="text-sm hover:text-blue-600 font-medium transition">Contact</Link>
        </div>

        {/* Center Search */}
        <div className="hidden md:flex flex-grow max-w-md mx-6">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button className="bg-blue-600 px-4 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 transition">
            Search
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {!user ? (
            <>
              <button onClick={() => navigate("/login")} className="text-gray-700 text-sm hover:text-blue-600 transition">Login</button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <Link to="/notifications" className="text-sm hover:text-blue-600 font-medium">🔔</Link>
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center cursor-pointer border-2 border-blue-500 hover:scale-105 transition"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                {showProfile && (
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setShowProfile(false)}
                  />
                )}
              </div>
            </>
          )}

          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5 font-semibold shadow-sm">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
    </nav>
  );
};

export default Navbar;

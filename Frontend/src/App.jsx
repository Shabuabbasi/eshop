import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Navbar from './Components/Navbar';
import { ToastContainer } from 'react-toastify';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPassword from './Components/ForgetPassword';
import ResetPassword from './Components/ResetPassword';

const backendUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function App() {
const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/profile`, {
        withCredentials: true,
      });
      setUser(data.user); 
    } catch (err) {
      setUser(null);
      console.log("Not logged in");
    }
  };

  fetchUser();
}, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

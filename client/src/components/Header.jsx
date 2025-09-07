import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import API from "../api/axios";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const u = getUser();

  const loadCart = async () => {
    if (!u) return;
    try {
      const res = await API.get("/cart");
      setCartCount(res.data.length);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCart();
  }, [u]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          E-Shop
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-600">
            Products
          </Link>
          <Link to="/cart" className="relative hover:text-indigo-600">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {u ? (
            <>
              <span className="text-gray-700">Hi, {u.name}</span>
              <button
                onClick={() => {
                  clearAuth();
                  window.location.href = "/";
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">
                Login
              </Link>
              <Link to="/signup" className="hover:text-indigo-600">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

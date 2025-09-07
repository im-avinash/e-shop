import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      saveAuth(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          value={email} onChange={e=>setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          value={password} onChange={e=>setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

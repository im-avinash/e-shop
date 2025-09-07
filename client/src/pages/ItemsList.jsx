import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const load = useCallback(async () => {
    const res = await API.get("/items", { params: filters });
    setItems(res.data);
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const addToCart = async (id) => {
    try {
      await API.post("/cart", { item_id: id, quantity: 1 });
      alert("Added to cart");
    } catch {
      alert("Please login first");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          placeholder="Search..."
          className="border rounded px-3 py-2"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <input
          placeholder="Min Price"
          className="border rounded px-3 py-2"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          placeholder="Max Price"
          className="border rounded px-3 py-2"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
        <button
          onClick={load}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Apply
        </button>
      </div>

      {/* Items grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={it.image_url || "https://via.placeholder.com/300"}
              alt={it.title}
              className="rounded-t-xl w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="text-gray-500 text-sm">
                {it.description?.slice(0, 60)}...
              </p>
              <p className="text-indigo-600 font-bold">₹{it.price}</p>
              <button
                onClick={() => addToCart(it.id)}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

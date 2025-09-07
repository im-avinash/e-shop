import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const load = useCallback(async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateQty = async (id, qty) => {
    await API.post("/cart", { item_id: id, quantity: qty });
    load();
  };

  const removeItem = async (id) => {
    await API.delete(`/cart/${id}`);
    load();
  };

  const total = cart.reduce(
    (sum, c) => sum + c.quantity * parseFloat(c.Item.price),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((ci) => (
            <div
              key={ci.id}
              className="flex items-center bg-white p-4 rounded-lg shadow"
            >
              <img
                src={ci.Item.image_url}
                alt=""
                className="w-20 h-20 rounded object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{ci.Item.title}</h3>
                <p className="text-gray-500">₹{ci.Item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQty(ci.item_id, Math.max(1, ci.quantity - 1))
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{ci.quantity}</span>
                <button
                  onClick={() => updateQty(ci.item_id, ci.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(ci.item_id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-bold mt-4">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

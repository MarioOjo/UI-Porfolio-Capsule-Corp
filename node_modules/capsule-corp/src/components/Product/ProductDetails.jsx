import { useState } from "react";
import apiFetch from "../../utils/api";

function formatCurrency(cents = 0) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

// ...existing code...
export default function ProductDetails({ product = {}, onAdded }) {
  const {
    id,
    name = "ELITE SCOUTER",
    power_level = "1,000,000+",
    in_stock = true,
    stock = 1,
    price_cents = 129900,
    compare_price_cents = 159900,
    discount_label = "19% OFF",
  } = product;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxQty = Number.isFinite(stock) ? Math.max(1, stock) : Infinity;
  const isOutOfStock = stock === 0 || !in_stock;

  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  function inc() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }
  function setQtyFromInput(v) {
    const n = Number(v) || 1;
    setQuantity(Math.max(1, Math.min(maxQty, Math.floor(n))));
  }

  async function handleAddToCart() {
    if (isOutOfStock) return;
    setError("");
    setLoading(true);
    try {
      // call backend cart endpoint (ensure api has /api/cart)
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (typeof onAdded === "function") onAdded({ productId: id, quantity });
    } catch (err) {
      setError(err?.body?.error || err?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">{name}</h1>
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-neutral-600 text-white px-3 py-1 rounded text-sm">
            PL: {power_level}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm ${
              isOutOfStock ? "bg-red-100 text-red-700" : "bg-neutral-200"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "In Stock"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {compare_price_cents ? (
            <span className="text-2xl line-through text-neutral-500">
              {formatCurrency(compare_price_cents)}
            </span>
          ) : null}
          <span className="text-3xl text-black">{formatCurrency(price_cents)}</span>
          {discount_label && (
            <span className="bg-black text-white px-2 py-1 rounded text-sm">
              {discount_label}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm" htmlFor="qty-input">
            Quantity:
          </label>
          <div className="flex items-center border rounded-lg">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={dec}
              className="px-3 py-2 hover:bg-neutral-100"
              disabled={quantity <= 1 || loading}
            >
              −
            </button>
            <input
              id="qty-input"
              aria-label="Quantity"
              value={quantity}
              onChange={(e) => setQtyFromInput(e.target.value)}
              className="w-16 text-center px-4 py-2 border-l border-r"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={loading}
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={inc}
              className="px-3 py-2 hover:bg-neutral-100"
              disabled={quantity >= maxQty || loading || isOutOfStock}
            >
              +
            </button>
          </div>
          {Number.isFinite(stock) && (
            <span className="text-sm text-neutral-500">({stock} available)</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className={`w-full py-3 rounded-lg transition-colors ${
            isOutOfStock
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-black text-white hover:bg-neutral-800"
          }`}
          aria-disabled={isOutOfStock || loading}
        >
          {loading ? "Adding..." : isOutOfStock ? "OUT OF STOCK" : "ADD TO CAPSULE"}
        </button>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <svg
            className="w-4 h-4 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L3 6v6c0 5.25 3.75 9.75 9 10 5.25-.25 9-4.75 9-10V6l-9-4z" />
          </svg>
          <span>Instant Transmission Shipping Available</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LOCAL_CART_KEY = "capsule_cart_v1";

function parseCents(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ""));
    return isNaN(n) ? 0 : Math.round(n * 100);
  }
  return 0;
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Cart({ cartCount, setCartCount }) {
  const [items, setItems] = useState([]);

  // load & normalize cart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const normalized = (parsed || []).map((it) => {
        const priceCents = typeof it.priceCents === "number"
          ? it.priceCents
          : (it.price ? parseCents(it.price) : parseCents(it.price_cents));
        return {
          id: it.id ?? it.sku ?? it.name,
          name: it.name ?? "Unknown product",
          sku: it.sku ?? "",
          img: it.img ?? it.image ?? null,
          qty: Math.max(1, Number(it.qty) || 1),
          priceCents,
        };
      });
      setItems(normalized);
      if (typeof setCartCount === "function") {
        setCartCount(normalized.reduce((s, i) => s + (i.qty || 0), 0));
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
      setItems([]);
      if (typeof setCartCount === "function") setCartCount(0);
    }
  }, [setCartCount]);

  // persist & sync count whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch {}
    if (typeof setCartCount === "function") {
      setCartCount(items.reduce((s, i) => s + (i.qty || 0), 0));
    }
  }, [items, setCartCount]);

  const updateItem = (id, fn) => setItems((prev) => {
    const next = prev.map(i => i.id === id ? fn(i) : i).filter(i => i.qty > 0);
    return next;
  });

  const changeQty = (id, delta) => {
    updateItem(id, (it) => ({ ...it, qty: Math.max(0, (it.qty || 1) + delta) }));
  };

  const setQty = (id, qty) => {
    updateItem(id, (it) => ({ ...it, qty: Math.max(0, qty) }));
  };

  const removeItem = (id) => setItems((prev) => prev.filter(i => i.id !== id));

  const clearCart = () => setItems([]);

  const subtotalCents = items.reduce((s, it) => s + (it.priceCents || 0) * (it.qty || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-saiyan text-[#3B4CCA] mb-8">Your Capsule Cart</h1>

      {items.length === 0 ? (
        <div className="bg-[#F3F4F6] border-2 border-dashed border-[#3B4CCA] rounded-lg p-10 text-center">
          <p className="text-lg text-[#3B4CCA] mb-4">Your cart is currently empty.</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 border-[#3B4CCA] rounded-lg shadow">
              <thead>
                <tr className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white">
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-6">Qty</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#3B4CCA]">
                      <div className="flex items-center space-x-4">
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm">No Img</div>
                        )}
                        <div>
                          <div>{item.name}</div>
                          {item.sku && <div className="text-sm text-gray-500">{item.sku}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          className="px-2 py-1 bg-[#3B4CCA] text-white rounded hover:bg-[#FF9E00] transition"
                          onClick={() => changeQty(item.id, -1)}
                          disabled={(item.qty || 1) <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >-</button>

                        <input
                          type="number"
                          value={item.qty}
                          min="1"
                          onChange={(e) => setQty(item.id, Math.max(1, Number(e.target.value || 1)))}
                          className="w-16 text-center border rounded px-2 py-1"
                          aria-label={`Quantity for ${item.name}`}
                        />

                        <button
                          className="px-2 py-1 bg-[#3B4CCA] text-white rounded hover:bg-[#FF9E00] transition"
                          onClick={() => changeQty(item.id, +1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >+</button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#FF9E00] font-bold">
                      {formatPrice((item.priceCents || 0) * (item.qty || 1))}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        className="text-red-500 hover:text-red-700 font-bold"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-8">
            <div className="text-xl font-bold text-[#3B4CCA] mb-4 md:mb-0">
              Total: <span className="text-[#FF9E00]">{formatPrice(subtotalCents)}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 rounded bg-neutral-100"
                onClick={clearCart}
              >
                Clear cart
              </button>

              <button
                className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
                onClick={() => alert("Checkout not implemented yet.")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
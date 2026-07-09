import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { restaurants, menuItems } from "../data/mockData";
import { useCart } from "../context/CartContext";
import type { MenuItem } from "../data/mockData";

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const { items, addItem, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);

  const restaurant = restaurants.find((r) => r.id === id);
  const menu = menuItems[id || ""] || [];

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-xl font-bold text-gray-900">Restaurant not found</h2>
        <Link to="/restaurants" className="mt-4 text-red-500 font-semibold hover:underline">
          Browse all restaurants
        </Link>
      </div>
    );
  }

  const categories = [...new Set(menu.map((m) => m.category))];
  const filtered = menu.filter((m) => {
    if (vegOnly && !m.isVeg) return false;
    if (activeCategory && m.category !== activeCategory) return false;
    return true;
  });

  const getCartQty = (itemId: string) => items.find((i) => i.id === itemId)?.quantity || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 bg-gray-200 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{restaurant.name}</h1>
                <p className="text-white/80 text-sm mt-1">{restaurant.cuisine.join(", ")}</p>
                <p className="text-white/60 text-xs mt-0.5">{restaurant.location}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                <div className="flex items-center gap-1 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-black text-xl">{restaurant.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{(restaurant.reviewCount / 1000).toFixed(1)}K+ ratings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee} delivery charge`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Min. order ₹{restaurant.minOrder}</span>
            </div>
            {restaurant.offer && (
              <div className="flex items-center gap-1.5 text-orange-600 font-semibold">
                <span>🏷️</span>
                <span>{restaurant.offer}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Category Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-36 bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors ${
                !activeCategory ? "bg-red-50 text-red-600 border-l-4 border-l-red-500" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors ${
                  activeCategory === cat ? "bg-red-50 text-red-600 border-l-4 border-l-red-500" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Menu */}
        <main className="flex-1 min-w-0">
          {/* Veg toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide lg:hidden">
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  !activeCategory ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <span className="text-xs font-semibold text-green-700">Veg only</span>
              <div
                onClick={() => setVegOnly(!vegOnly)}
                className={`relative w-10 h-5 rounded-full transition-colors ${vegOnly ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${vegOnly ? "translate-x-5" : ""}`} />
              </div>
            </label>
          </div>

          {/* Menu sections by category */}
          {categories
            .filter((cat) => !activeCategory || cat === activeCategory)
            .map((cat) => {
              const catItems = filtered.filter((m) => m.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat} className="mb-8">
                  <h2 className="text-base font-black text-gray-900 mb-3 pb-2 border-b border-gray-100">
                    {cat} <span className="text-gray-400 font-normal text-sm">({catItems.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {catItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        qty={getCartQty(item.id)}
                        onAdd={() => addItem(item, restaurant.id, restaurant.name)}
                        onInc={() => updateQuantity(item.id, getCartQty(item.id) + 1)}
                        onDec={() => updateQuantity(item.id, getCartQty(item.id) - 1)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="text-4xl mb-3">🥗</span>
              <p className="text-gray-500">No items match your filters</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Link
            to="/cart"
            className="flex items-center gap-3 bg-red-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl hover:bg-red-600 transition-colors font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{items.reduce((s, i) => s + i.quantity, 0)} items added</span>
            <span>•</span>
            <span>View Cart</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function MenuItemCard({
  item,
  qty,
  onAdd,
  onInc,
  onDec,
}: {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Veg indicator */}
      <div className="flex flex-col gap-1 pt-0.5 shrink-0">
        <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
          <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
        </div>
        {item.popular && (
          <span className="text-[10px] font-bold text-orange-500 leading-none">BEST<br />SELLER</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">₹{item.price}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
      </div>

      {/* Image + Add */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        {qty === 0 ? (
          <button
            onClick={onAdd}
            className="w-24 py-1.5 border-2 border-red-500 text-red-500 font-bold text-xs rounded-lg hover:bg-red-50 transition-colors"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 w-24 justify-between">
            <button onClick={onDec} className="w-7 h-7 bg-red-500 text-white rounded-lg font-bold text-base hover:bg-red-600 flex items-center justify-center">
              −
            </button>
            <span className="font-bold text-gray-900 text-sm">{qty}</span>
            <button onClick={onInc} className="w-7 h-7 bg-red-500 text-white rounded-lg font-bold text-base hover:bg-red-600 flex items-center justify-center">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

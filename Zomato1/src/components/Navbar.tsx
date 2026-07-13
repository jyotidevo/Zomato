import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-black text-red-500 tracking-tight">zomato</span>
          </Link>

          {/* Location */}
          <button className="hidden sm:flex items-center gap-1 text-sm text-gray-700 hover:text-red-500 transition-colors shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Chennai</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:border-red-300 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/restaurants"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
            >
              Restaurants
            </Link>
            <Link
              to="/orders"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
            >
              Orders
            </Link>
            {(() => {
              try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                if (user?.isAdmin) return (
                  <Link
                    to="/admin"
                    className="hidden md:block text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors px-3 py-1 rounded-lg"
                    style={{ background: "rgba(147,51,234,0.1)", border: "1px solid rgba(147,51,234,0.3)" }}
                  >
                    🛡️ Admin
                  </Link>
                );
              } catch {}
              return null;
            })()}
            {localStorage.getItem("token") ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:block text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1"
                >
                  Signup
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

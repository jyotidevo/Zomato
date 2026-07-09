import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const PROMO_CODES: Record<string, number> = {
  ZOMATO50: 50,
  FIRST100: 100,
  SAVE20: 20,
};

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [address] = useState("12, Anna Nagar East, Chennai - 600102");

  const discount = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const deliveryFee = totalPrice > 400 ? 0 : 30;
  const taxes = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice - discount + deliveryFee + taxes;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try ZOMATO50 or FIRST100");
    }
  };

  const placeOrder = () => {
    clearCart();
    navigate("/orders?new=1");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-sm">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add items from a restaurant to get started</p>
          <Link
            to="/restaurants"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const restaurantName = items[0]?.restaurantName;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {/* Restaurant info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ordering from</p>
                <p className="font-bold text-gray-900">{restaurantName}</p>
              </div>
              <Link to={`/restaurant/${items[0]?.restaurantId}`} className="ml-auto text-xs text-red-500 font-semibold hover:underline">
                Add more items
              </Link>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {items.map((item, idx) => (
                <div key={item.id} className={`flex items-center gap-4 px-4 py-4 ${idx < items.length - 1 ? "border-b border-gray-50" : ""}`}>
                  {/* Veg indicator */}
                  <div className={`w-4 h-4 shrink-0 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? "border-green-600" : "border-red-600"}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border-2 border-red-500 text-red-500 rounded-lg font-bold flex items-center justify-center hover:bg-red-50">
                      −
                    </button>
                    <span className="w-6 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-red-500 text-white rounded-lg font-bold flex items-center justify-center hover:bg-red-600">
                      +
                    </button>
                  </div>
                  <p className="font-bold text-gray-900 text-sm w-16 text-right">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Delivery Address</h3>
                <button className="text-xs text-red-500 font-semibold hover:underline">Change</button>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Home</p>
                  <p className="text-xs text-gray-500 mt-0.5">{address}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                {["Cash on Delivery", "UPI (Google Pay / PhonePe)", "Credit / Debit Card"].map((method, i) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer py-2 border-b border-gray-50 last:border-0">
                    <input type="radio" name="payment" defaultChecked={i === 0} className="accent-red-500" />
                    <span className="text-sm text-gray-700 font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0 space-y-4">
            {/* Promo Code */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                  placeholder="Enter code (ZOMATO50)"
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300"
                />
                <button
                  onClick={applyPromo}
                  className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
              {appliedPromo && (
                <div className="flex items-center justify-between mt-2 bg-green-50 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-green-700">🎉 {appliedPromo} applied! −₹{discount}</span>
                  <button onClick={() => { setAppliedPromo(null); setPromoCode(""); }} className="text-xs text-gray-400 hover:text-red-500">✕</button>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900">₹{totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span className="font-semibold">−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium text-gray-900">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST & Charges</span>
                  <span className="font-medium text-gray-900">₹{taxes}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                  <span className="font-black text-gray-900">To Pay</span>
                  <span className="font-black text-gray-900 text-lg">₹{finalTotal}</span>
                </div>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Add ₹{400 - totalPrice} more for free delivery
                </p>
              )}
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl text-base transition-colors shadow-lg shadow-red-200"
            >
              Place Order • ₹{finalTotal}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By placing your order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

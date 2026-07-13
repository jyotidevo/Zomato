import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";

const STEPS = [
  { id: 1, label: "Order Placed", icon: "✅", desc: "Your order has been received" },
  { id: 2, label: "Preparing", icon: "🍳", desc: "Restaurant is preparing your food" },
  { id: 3, label: "Out for Delivery", icon: "🛵", desc: "Your rider is on the way" },
  { id: 4, label: "Delivered", icon: "🎉", desc: "Enjoy your meal!" },
];

const PAST_ORDERS = [
  {
    id: "ORD8821",
    restaurant: "Buhari Hotel",
    items: ["Chicken Biryani x1", "Butter Naan x2"],
    total: 380,
    date: "2 Jul 2024",
    status: "Delivered",
    rating: 4,
  },
  {
    id: "ORD7745",
    restaurant: "Pizza Hut",
    items: ["Margherita Pizza x1", "Chocolate Lava Cake x1"],
    total: 530,
    date: "28 Jun 2024",
    status: "Delivered",
    rating: 5,
  },
  {
    id: "ORD6690",
    restaurant: "Saravana Bhavan",
    items: ["Masala Dosa x2", "Filter Coffee x2"],
    total: 360,
    date: "20 Jun 2024",
    status: "Delivered",
    rating: 5,
  },
];

interface DbOrder {
  orderId: string;
  restaurantName: string;
  grandTotal: number;
  status: string;
  createdAt: string;
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const isNew = searchParams.get("new") === "1" || !!orderId;
  
  const [currentStep, setCurrentStep] = useState(orderId ? 1 : (isNew ? 1 : 0));
  const [eta, setEta] = useState(38);
  const [dbOrder, setDbOrder] = useState<DbOrder | null>(null);

  // Status mapping
  const getStepFromStatus = (status: string) => {
    switch (status) {
      case "Order Placed": return 1;
      case "Preparing": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      case "Cancelled": return 0;
      case "Refunded": return 0;
      default: return 1;
    }
  };

  const getEtaFromStep = (step: number) => {
    switch (step) {
      case 1: return 38;
      case 2: return 28;
      case 3: return 12;
      case 4: return 0;
      default: return 0;
    }
  };

  // Poll database if orderId is present
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDbOrder(data);
          const step = getStepFromStatus(data.status);
          setCurrentStep(step);
          setEta(getEtaFromStep(step));
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchOrderStatus(); // initial fetch
    const interval = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Fallback local simulation if no orderId, just generic isNew
  useEffect(() => {
    if (orderId || !isNew) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => { setCurrentStep(2); setEta(32); }, 3000));
    timers.push(setTimeout(() => { setCurrentStep(3); setEta(18); }, 7000));
    timers.push(setTimeout(() => { setCurrentStep(4); setEta(0); }, 14000));
    return () => timers.forEach(clearTimeout);
  }, [isNew, orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Active Order */}
        {isNew && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-xs font-medium uppercase tracking-widest mb-1">
                    {dbOrder ? `Order Status: ${dbOrder.status}` : "Active Order"}
                  </p>
                  <h1 className="text-2xl font-black">
                    {dbOrder && (dbOrder.status === "Cancelled" || dbOrder.status === "Refunded")
                      ? `Order ${dbOrder.status} ❌`
                      : currentStep < 4
                      ? `Arriving in ${eta} min`
                      : "Order Delivered! 🎉"}
                  </h1>
                  <p className="text-red-100 text-sm mt-1">
                    Order #{dbOrder ? dbOrder.orderId : "ORD9934"} • {dbOrder ? dbOrder.restaurantName : "Buhari Hotel"}
                  </p>
                </div>
                <div className="text-5xl">
                  {dbOrder && (dbOrder.status === "Cancelled" || dbOrder.status === "Refunded")
                    ? "❌"
                    : currentStep < 3
                    ? "🍳"
                    : currentStep === 3
                    ? "🛵"
                    : "🎉"}
                </div>
              </div>

              {/* Progress bar */}
              {currentStep > 0 && currentStep < 4 && (
                <div className="mt-5 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-300 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="p-6">
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />

                <div className="space-y-6">
                  {STEPS.map((step) => {
                    const done = currentStep >= step.id;
                    const active = currentStep === step.id;
                    return (
                      <div key={step.id} className="flex items-start gap-4 relative">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                          done ? "bg-green-500 shadow-lg shadow-green-200" : "bg-gray-100"
                        } ${active ? "ring-4 ring-green-200 scale-110" : ""}`}>
                          {done ? "✓" : step.icon}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className={`text-sm font-bold ${done ? "text-gray-900" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          <p className={`text-xs mt-0.5 ${done ? "text-gray-500" : "text-gray-300"}`}>
                            {step.desc}
                          </p>
                        </div>
                        {active && currentStep < 4 && (
                          <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-full animate-pulse">
                            In progress
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rider Info */}
            {currentStep >= 3 && currentStep < 4 && (
              <div className="border-t border-gray-100 p-6">
                <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">Your Rider</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                    👨‍🦱
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Ravi Kumar</p>
                    <p className="text-xs text-gray-500">⭐ 4.8 · 2,341 deliveries</p>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                      📞
                    </button>
                    <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                      💬
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delivered Actions */}
            {currentStep === 4 && (
              <div className="border-t border-gray-100 p-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/restaurants"
                  className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  Order Again
                </Link>
                <button className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors">
                  Rate Order ⭐
                </button>
              </div>
            )}
          </div>
        )}

        {/* Past Orders */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            {isNew ? "Past Orders" : "Your Orders"}
          </h2>
          <div className="space-y-4">
            {PAST_ORDERS.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{order.restaurant}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.date} · #{order.id}</p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {order.items.map((item) => (
                      <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-900">₹{order.total}</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < order.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to="/restaurants"
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isNew && (
          <div className="mt-8 text-center">
            <Link
              to="/restaurants"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-colors"
            >
              Order Something New 🍔
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

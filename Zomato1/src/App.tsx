import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";

export default function App() {
  const [data, setData] = useState({ isLoggedIn: !!localStorage.getItem("token") });

  // Prevent unused warnings by referencing variables or using comments
  console.log("Auth state:", { data });

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setData={setData} />} />
          <Route path="/signup" element={<Signup setData={setData} />} />
          <Route path="/product" element={<Product />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderTracking />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

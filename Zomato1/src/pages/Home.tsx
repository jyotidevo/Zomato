import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { restaurants, categories } from "../data/mockData";
import RestaurantCard from "../components/RestaurantCard";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/restaurants?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const topRated = restaurants.filter((r) => r.rating >= 4.3);
  const freeDelivery = restaurants.filter((r) => r.deliveryFee === 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 w-60 h-60 rounded-full bg-yellow-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-red-100 font-medium text-sm mb-2 tracking-widest uppercase">Order Food Online</p>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Discover the best<br />
              <span className="text-yellow-300">food & drinks</span> in Chennai
            </h1>
            <p className="text-red-100 mb-8 text-lg">
              Get your favourite food delivered hot and fresh at your doorstep.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for biryani, pizza..."
                  className="w-full pl-10 pr-4 py-3.5 text-gray-900 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-5">
              {["Biryani", "Pizza", "Burger", "South Indian"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/restaurants?q=${tag}`)}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative food image */}
        <div className="absolute right-0 bottom-0 hidden lg:block w-96 h-full overflow-hidden opacity-80">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=600&fit=crop&auto=format"
            alt="Delicious food spread"
            className="w-full h-full object-cover mix-blend-luminosity"
          />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {[
              { label: "Restaurants", value: "500+" },
              { label: "Cuisines", value: "120+" },
              { label: "Avg delivery", value: "30 min" },
              { label: "Happy customers", value: "2M+" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 shrink-0">
                <span className="text-lg font-black text-red-500">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-black text-gray-900 mb-5">
          What are you craving?
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/restaurants?q=${cat.name}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Top Rated Near You</h2>
          <Link to="/restaurants" className="text-sm font-semibold text-red-500 hover:text-red-600">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topRated.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* Free Delivery */}
      <section className="bg-orange-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛵</span>
              <h2 className="text-xl font-black text-gray-900">Free Delivery</h2>
            </div>
            <Link to="/restaurants?filter=freeDelivery" className="text-sm font-semibold text-red-500 hover:text-red-600">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {freeDelivery.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      </section>

      {/* All Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-black text-gray-900 mb-5">All Restaurants in Chennai</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* App Banner */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black mb-2">Get the Zomato app</h2>
            <p className="text-gray-400 text-sm">We will send you a link, open it on your phone to download the app</p>
            <div className="flex gap-3 mt-5">
              <button className="bg-white text-gray-900 font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                App Store
              </button>
              <button className="bg-white text-gray-900 font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Google Play
              </button>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop&auto=format"
            alt="Mobile app"
            className="w-48 h-32 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div>
              <span className="text-2xl font-black text-white">zomato</span>
              <p className="mt-2 text-sm max-w-xs">
                Delivering happiness to your doorstep. Order from thousands of restaurants across India.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              {[
                { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
                { title: "For Restaurants", links: ["Partner With Us", "Apps for You"] },
                { title: "Learn More", links: ["Privacy", "Terms", "Sitemap", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-white font-bold mb-3">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a href="#" className="hover:text-white transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
            © 2024 Zomato Clone. Built for demo purposes.
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { restaurants } from "../data/mockData";
import RestaurantCard from "../components/RestaurantCard";

const SORT_OPTIONS = ["Relevance", "Rating", "Delivery Time", "Cost: Low to High", "Cost: High to Low"];
const FILTERS = ["Fast Delivery", "Pure Veg", "Free Delivery", "Rating 4.0+", "Offers"];

export default function Restaurants() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeSort, setActiveSort] = useState("Relevance");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const filtered = useMemo(() => {
    let list = [...restaurants];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.cuisine.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (activeFilters.includes("Pure Veg")) list = list.filter((r) => r.isVeg);
    if (activeFilters.includes("Free Delivery")) list = list.filter((r) => r.deliveryFee === 0);
    if (activeFilters.includes("Rating 4.0+")) list = list.filter((r) => r.rating >= 4.0);
    if (activeFilters.includes("Offers")) list = list.filter((r) => !!r.offer);
    if (activeFilters.includes("Fast Delivery")) list = list.filter((r) => parseInt(r.deliveryTime) <= 30);

    if (activeSort === "Rating") list.sort((a, b) => b.rating - a.rating);
    if (activeSort === "Delivery Time") list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    if (activeSort === "Cost: Low to High") list.sort((a, b) => a.minOrder - b.minOrder);
    if (activeSort === "Cost: High to Low") list.sort((a, b) => b.minOrder - a.minOrder);

    return list;
  }, [query, activeSort, activeFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-black text-gray-900">
              {query ? `Results for "${query}"` : "All Restaurants"}
              <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} restaurants)</span>
            </h1>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  activeFilters.includes(f)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto scrollbar-hide py-2">
            <span className="text-xs text-gray-400 shrink-0 self-center mr-1">Sort:</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSort(s)}
                className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  activeSort === s
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🍽️</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h2>
            <p className="text-gray-500 text-sm">Try a different search or remove some filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { Restaurant } from "../data/mockData";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="relative overflow-hidden bg-gray-100 h-44">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {restaurant.offer && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <span className="text-xs font-bold text-yellow-300">{restaurant.offer}</span>
          </div>
        )}
        {restaurant.promoted && (
          <span className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
            Promoted
          </span>
        )}
        {restaurant.isVeg && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Pure Veg
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-0.5 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shrink-0">
            <span>{restaurant.rating}</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{restaurant.cuisine.join(", ")}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {restaurant.deliveryTime}
          </span>
          <span>•</span>
          <span>
            {restaurant.deliveryFee === 0 ? (
              <span className="text-green-600 font-semibold">Free delivery</span>
            ) : (
              `₹${restaurant.deliveryFee} delivery`
            )}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{restaurant.location}</p>
      </div>
    </Link>
  );
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  offer?: string;
  isVeg?: boolean;
  location: string;
  promoted?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  category: string;
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Buhari Hotel",
    cuisine: ["North Indian", "Mughlai", "Biryani"],
    rating: 4.3,
    reviewCount: 2840,
    deliveryTime: "35-45 min",
    deliveryFee: 30,
    minOrder: 200,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
    offer: "50% off up to ₹100",
    location: "Anna Nagar, Chennai",
    promoted: true,
  },
  {
    id: "2",
    name: "Pizza Hut",
    cuisine: ["Pizzas", "Pastas", "Desserts"],
    rating: 4.1,
    reviewCount: 5120,
    deliveryTime: "25-35 min",
    deliveryFee: 0,
    minOrder: 150,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    offer: "Buy 1 Get 1 Free",
    location: "T Nagar, Chennai",
  },
  {
    id: "3",
    name: "Saravana Bhavan",
    cuisine: ["South Indian", "Tamil", "Tiffin"],
    rating: 4.5,
    reviewCount: 8930,
    deliveryTime: "20-30 min",
    deliveryFee: 20,
    minOrder: 100,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop&auto=format",
    isVeg: true,
    offer: "20% off on first order",
    location: "Mylapore, Chennai",
    promoted: true,
  },
  {
    id: "4",
    name: "McDonald's",
    cuisine: ["Burgers", "Wraps", "Fries"],
    rating: 4.0,
    reviewCount: 11200,
    deliveryTime: "20-30 min",
    deliveryFee: 0,
    minOrder: 99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    offer: "Free McFlurry on orders above ₹399",
    location: "Nungambakkam, Chennai",
  },
  {
    id: "5",
    name: "Barbeque Nation",
    cuisine: ["BBQ", "North Indian", "Chinese"],
    rating: 4.4,
    reviewCount: 3650,
    deliveryTime: "40-50 min",
    deliveryFee: 50,
    minOrder: 500,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&auto=format",
    offer: "Flat ₹200 off",
    location: "Adyar, Chennai",
  },
  {
    id: "6",
    name: "Domino's Pizza",
    cuisine: ["Pizzas", "Sides", "Beverages"],
    rating: 3.9,
    reviewCount: 14500,
    deliveryTime: "25-35 min",
    deliveryFee: 0,
    minOrder: 150,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop&auto=format",
    offer: "30 Min Guarantee",
    location: "Velachery, Chennai",
  },
  {
    id: "7",
    name: "Subway",
    cuisine: ["Healthy Food", "Salads", "Sandwiches"],
    rating: 4.2,
    reviewCount: 6780,
    deliveryTime: "20-30 min",
    deliveryFee: 25,
    minOrder: 120,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop&auto=format",
    location: "OMR, Chennai",
  },
  {
    id: "8",
    name: "Anjappar Chettinad",
    cuisine: ["Chettinad", "South Indian", "Seafood"],
    rating: 4.6,
    reviewCount: 4210,
    deliveryTime: "35-45 min",
    deliveryFee: 40,
    minOrder: 300,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=400&fit=crop&auto=format",
    offer: "10% off with HDFC Bank",
    location: "Kodambakkam, Chennai",
    promoted: true,
  },
];

export const menuItems: Record<string, MenuItem[]> = {
  "1": [
    {
      id: "m1",
      name: "Chicken Biryani",
      description: "Aromatic basmati rice cooked with tender chicken, saffron, and whole spices",
      price: 280,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&auto=format",
      isVeg: false,
      category: "Biryani",
      popular: true,
    },
    {
      id: "m2",
      name: "Mutton Biryani",
      description: "Slow-cooked mutton with long-grain rice and aromatic spices",
      price: 360,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop&auto=format",
      isVeg: false,
      category: "Biryani",
    },
    {
      id: "m3",
      name: "Chicken Tikka",
      description: "Marinated chicken pieces grilled in tandoor, served with mint chutney",
      price: 320,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format",
      isVeg: false,
      category: "Starters",
      popular: true,
    },
    {
      id: "m4",
      name: "Dal Makhani",
      description: "Black lentils slow-cooked overnight with butter and cream",
      price: 180,
      image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Main Course",
    },
    {
      id: "m5",
      name: "Butter Naan",
      description: "Soft leavened bread baked in tandoor, brushed with butter",
      price: 50,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Breads",
    },
    {
      id: "m6",
      name: "Chicken Korma",
      description: "Chicken in rich, creamy cashew-based gravy with fragrant spices",
      price: 290,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format",
      isVeg: false,
      category: "Main Course",
      popular: true,
    },
  ],
  "2": [
    {
      id: "m7",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
      price: 350,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Pizzas",
      popular: true,
    },
    {
      id: "m8",
      name: "Chicken Supreme",
      description: "Loaded pizza with chicken, capsicum, mushrooms, and olives",
      price: 520,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format",
      isVeg: false,
      category: "Pizzas",
    },
    {
      id: "m9",
      name: "Pasta Arrabiata",
      description: "Penne in spicy tomato sauce with garlic and red chili",
      price: 280,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Pastas",
    },
    {
      id: "m10",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 180,
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Desserts",
      popular: true,
    },
  ],
  "3": [
    {
      id: "m11",
      name: "Masala Dosa",
      description: "Crispy rice crepe filled with spiced potato masala, served with chutneys",
      price: 120,
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Tiffin",
      popular: true,
    },
    {
      id: "m12",
      name: "Idli Sambar",
      description: "Steamed rice cakes with lentil soup and coconut chutney",
      price: 80,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Tiffin",
    },
    {
      id: "m13",
      name: "Rava Upma",
      description: "Savory semolina porridge with vegetables and spices",
      price: 90,
      image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Tiffin",
    },
    {
      id: "m14",
      name: "Filter Coffee",
      description: "Traditional South Indian decoction coffee with milk",
      price: 60,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&auto=format",
      isVeg: true,
      category: "Beverages",
      popular: true,
    },
  ],
};

export const categories = [
  { id: "1", name: "Biryani", icon: "🍛", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop&auto=format" },
  { id: "2", name: "Pizza", icon: "🍕", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop&auto=format" },
  { id: "3", name: "Burger", icon: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&auto=format" },
  { id: "4", name: "South Indian", icon: "🥘", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop&auto=format" },
  { id: "5", name: "Chinese", icon: "🍜", image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=200&h=200&fit=crop&auto=format" },
  { id: "6", name: "Desserts", icon: "🍰", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200&h=200&fit=crop&auto=format" },
  { id: "7", name: "Healthy", icon: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&auto=format" },
  { id: "8", name: "Seafood", icon: "🦞", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&h=200&fit=crop&auto=format" },
];

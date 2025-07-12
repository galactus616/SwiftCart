import React from "react";
import { ShoppingCart, Leaf, ChevronRight } from "lucide-react";

const PromoBanner = () => {
  return (
    <section
      className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-md"
      aria-label="Special offer: Fresh groceries delivery"
    >
      {/* Background Image with performance optimizations */}
      <img
        src="https://res.cloudinary.com/deepmitra/image/upload/v1752241825/home_page_kr451d.jpg"
        alt="Fresh groceries including fruits, vegetables, and yogurt"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent backdrop-blur-[2px]" />

      {/* Improved glassmorphic panel with better contrast */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-12">
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-white/50 p-4 md:p-6 rounded-2xl shadow-lg max-w-md transition-all hover:shadow-xl hover:ring-white/70">
          <div className="flex items-center mb-2">
            <Leaf className="w-4 h-4 text-green-700" aria-hidden="true" />
            <span className="ml-2 text-green-800 font-semibold text-md">
              SwiftCart
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
            Fresh groceries,
            <br className="hidden sm:block" />
            faster at your door
          </h1>

          <p className="mt-1 text-gray-800 text-xs md:text-sm font-medium max-w-[90%]">
            Shop fruits, vegetables & daily needs in minutes
          </p>

          <button
            className="mt-3 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Start shopping now"
          >
            <ShoppingCart className="w-3 h-3 mr-2" aria-hidden="true" />
            Start Shopping
            <ChevronRight className="w-3 h-3 ml-2" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

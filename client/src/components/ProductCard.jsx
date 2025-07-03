import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ১. Link ইম্পোর্ট করুন
import { FiPlus } from "react-icons/fi";

const fallbackImg = "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80";

const getCurrencyInfo = (currency) => {
  if (currency === "INR") return { symbol: "₹", rate: 1 / 1.3 };
  return { symbol: "৳", rate: 1 };
};

const ProductCard = ({ product, addToCart, showToast }) => {
  console.log(product); // ২. navigate prop সরিয়ে দিন
  const [imgError, setImgError] = useState(false);
  const [currency, setCurrency] = useState(
    localStorage.getItem("swiftcart_currency") || "BDT"
  );

  useEffect(() => {
    const handler = (e) => setCurrency(e.detail.currency);
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  const { symbol, rate } = getCurrencyInfo(currency);
  const price = (product.price * rate).toFixed(2);

  const handleAddToCart = (e) => {
    // ৩. Link-এ ক্লিক করা থেকে আটকানোর জন্য
    e.preventDefault(); 
    e.stopPropagation();
    
    // ৪. addToCart ফাংশনে সঠিক ডেটা পাঠান
    addToCart(product.id || product._id, 1); 
    showToast(`${product.name} added to cart!`, "success");
  };

  return (
    // ৫. পুরো কার্ডটিকে Link দিয়ে মুড়িয়ে দিন
    <Link
      to={`/product/${product.id || product._id}`}
      className="group bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 font-inter flex flex-col h-full"
    >
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={!imgError ? product.imageUrl : fallbackImg}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#fd9404] mb-1 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm flex-grow mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-800">
            {symbol} {price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-[#fd9404] text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center gap-1"
          >
            <FiPlus className="h-5 w-5" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

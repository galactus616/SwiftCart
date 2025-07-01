import React, { useState, useEffect, useContext } from "react";
import { FiTruck, FiShield, FiGift, FiStar } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import { getProducts, getCategories } from "../api/products";
import { CartContext } from "../contexts/CartContext";

const whyShop = [
  {
    icon: <FiTruck size={28} className="text-emerald-500" />,
    title: "Fast Delivery",
    desc: "Groceries at your door in under 30 minutes.",
  },
  {
    icon: <FiStar size={28} className="text-yellow-400" />,
    title: "Top Quality",
    desc: "Only the freshest, best products always.",
  },
  {
    icon: <FiShield size={28} className="text-blue-500" />,
    title: "Secure",
    desc: "Safe payments & data. Shop with confidence.",
  },
  {
    icon: <FiGift size={28} className="text-emerald-400" />,
    title: "Exclusive Deals",
    desc: "Premium offers for our valued customers.",
  },
];

const HomePage = ({ navigate, searchQuery = "" }) => {
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(searchQuery),
          getCategories(),
        ]);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(
          "Failed to load products or categories. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const featuredItems = allProducts.filter((p) => p.isFeatured);
  const otherProducts = allProducts.filter(
    (p) => !p.isBestSeller && !p.isFeatured
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter text-gray-700 bg-white">
        <HiOutlineShoppingBag
          className="animate-bounce text-[#fd9404]"
          size={40}
        />
        <p className="text-lg ml-4">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-inter flex items-center justify-center bg-white">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md mx-auto border border-gray-100">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-white">
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-14 md:py-20 gap-10">
        <div className="flex-1 flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Premium Groceries,{" "}
            <span className="text-[#fd9404]">Delivered</span> Fast
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Everything you need, delivered to your door in minutes. Discover top
            deals, fresh picks, and exclusive offers every day.
          </p>
          <button
            onClick={() => navigate("categories")}
            className="px-8 py-3 bg-[#fd9404] text-white rounded-full font-semibold text-lg hover:bg-yellow-500 transition shadow"
          >
            Shop by Category
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
            alt="Minimal groceries"
            className="w-full max-w-md rounded-2xl shadow border border-gray-100 object-cover"
            style={{ minHeight: 260 }}
          />
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-2xl shadow p-8 mb-16 border border-gray-100 bg-white px-6">
        {whyShop.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center gap-2 p-2"
          >
            {item.icon}
            <span className="font-bold text-base text-gray-800 mt-2">
              {item.title}
            </span>
            <span className="text-gray-500 text-sm">{item.desc}</span>
          </div>
        ))}
      </section>

      <main className="w-full px-6 py-4">
        {searchQuery && (
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
            Search Results for "{searchQuery}"
          </h2>
        )}

        {/* Categories */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Categories
          </h2>
          <div className="flex justify-center overflow-x-auto overflow-hidden gap-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id || category._id}
                category={category}
                navigate={navigate}
              />
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        {bestSellers.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiStar className="text-yellow-400" /> Bestsellers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  navigate={navigate}
                  addToCart={addToCart}
                  showToast={showToast}
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiGift className="text-emerald-400" /> Featured
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredItems.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  navigate={navigate}
                  addToCart={addToCart}
                  showToast={showToast}
                />
              ))}
            </div>
          </section>
        )}

        {/* More Products */}
        {otherProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              More Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  navigate={navigate}
                  addToCart={addToCart}
                  showToast={showToast}
                />
              ))}
            </div>
          </section>
        )}
        {searchQuery && allProducts.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-8">
            No products found matching your search.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-100 bg-white w-full px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-xl font-extrabold text-emerald-700">
              SwiftCart
            </span>
            <span className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-500 transition"
              title="Twitter"
            >
              <FiStar size={22} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-500 transition"
              title="Instagram"
            >
              <FiGift size={22} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-emerald-600 transition"
              title="LinkedIn"
            >
              <FiShield size={22} />
            </a>
          </div>
        </div>
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HomePage;

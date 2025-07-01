import React, { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import { getProductsByCategory } from "../api/products";
import { CartContext } from "../contexts/CartContext";

const CategoryProductsPage = ({ navigate, params }) => {
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryName = params.categoryName || "All Products";

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsByCategory(categoryName);
        setProducts(data);
      } catch (err) {
        console.error(
          `Error fetching products for category ${categoryName}:`,
          err
        );
        setError("Failed to load products for this category.");
      } finally {
        setLoading(false);
      }
    };
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter text-gray-700">
        <p className="mt-20">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="container mx-auto px-4 py-8 text-center text-red-600 text-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("home")}
          className="flex items-center text-gray-600 hover:text-yellow-500 mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {categoryName}
        </h1>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                navigate={navigate}
                addToCart={addToCart}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-8">
            No products found in this category.
          </div>
        )}
      </div>
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

export default CategoryProductsPage;

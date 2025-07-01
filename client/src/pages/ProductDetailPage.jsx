import React, { useState, useEffect, useContext } from "react";
import Toast from "../components/Toast";
import { getProductById } from "../api/products";
import { CartContext } from "../contexts/CartContext";

const ProductDetailPage = ({ navigate, params }) => {
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgZoom, setImgZoom] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(params.productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    if (params.productId) {
      fetchProduct();
    }
  }, [params.productId]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      showToast("Product added to cart!", "success");
    } catch (err) {
      showToast("Failed to add to cart. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter text-gray-700">
        <svg
          className="animate-spin h-10 w-10 text-[#fd9404] mr-3"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("home")}
            className="px-6 py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            Sorry, this product does not exist.
          </p>
          <button
            onClick={() => navigate("home")}
            className="px-6 py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-10">
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

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div
              className={`relative w-full max-w-xs md:max-w-sm aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg border-4 border-white group ${
                imgZoom ? "scale-105" : ""
              }`}
              onMouseEnter={() => setImgZoom(true)}
              onMouseLeave={() => setImgZoom(false)}
              style={{ transition: "transform 0.3s cubic-bezier(.4,0,.2,1)" }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300"
                style={{ transform: imgZoom ? "scale(1.15)" : "scale(1)" }}
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10">
                  Bestseller
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold rounded-full px-3 py-1 shadow-lg z-10">
                  Featured
                </span>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#fd9404] mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-[#fd9404] mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              {product.description}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 12H6"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  className="w-16 text-center border-l border-r border-gray-300 px-2 py-1 text-lg font-medium text-gray-800 focus:outline-none"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto px-10 py-3 bg-[#fd9404] text-white rounded-xl font-semibold text-lg hover:bg-yellow-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Details
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Related Products Placeholder */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Related Products
          </h3>
          <div className="bg-gray-100 rounded-xl p-6 text-gray-500 text-center">
            (Related products carousel coming soon)
          </div>
        </div>
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

export default ProductDetailPage;

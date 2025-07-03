import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";
import { getProductById } from "../api/products";
import { CartContext } from "../contexts/CartContext";
import { FiLoader, FiChevronLeft, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle } from "react-icons/fi";

const ProductDetailPage = () => {
  const productId = useParams();
  const id = productId.id
  const navigate = useNavigate();
  
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // মাল্টি-ইমেজ গ্যালারির জন্য স্টেট
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!productId || id === "undefined") {
      console.error("Invalid Product ID, redirecting to home.");
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        // API থেকে একাধিক ছবি না এলে, imageUrl দিয়ে একটি অ্যারে তৈরি করুন
        if (!data.images || data.images.length === 0) {
            data.images = [data.imageUrl];
        }
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, quantity);
      showToast(`${product.name} added to cart!`, "success");
    } catch (err) {
      showToast("Failed to add to cart. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter text-gray-700 bg-gray-50">
        <FiLoader className="animate-spin h-10 w-10 text-[#fd9404] mr-3" />
        <p className="text-lg">Loading Product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error ? "Oops!" : "Product Not Found"}</h2>
          <p className="text-gray-700 mb-6">{error || "Sorry, the product you are looking for does not exist."}</p>
          <Link to="/" className="px-6 py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || [product.imageUrl];

  return (
    <div className="min-h-screen font-inter bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-[#fd9404] transition-colors font-semibold w-fit">
              <FiChevronLeft className="h-5 w-5 mr-1" />
              Back to Products
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 border border-gray-100 overflow-hidden">
              <img 
                src={productImages[selectedImageIndex]} 
                alt={`${product.name} - view ${selectedImageIndex + 1}`} 
                className="w-full h-full object-contain transition-transform duration-300"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {productImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg flex items-center justify-center p-1 border-2 transition-all overflow-hidden
                      ${selectedImageIndex === index ? 'border-[#fd9404] shadow-md' : 'border-gray-200 hover:border-gray-400'}`
                    }
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[#fd9404] mb-6">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="text-gray-600 space-y-4 mb-8">
                <p>{product.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-8">
                <FiCheckCircle />
                <span>In Stock</span>
            </div>

            {/* Add to Cart Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg">
                  <FiMinus />
                </button>
                <span className="w-16 text-center text-lg font-semibold text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg">
                  <FiPlus />
                </button>
              </div>
              <button onClick={handleAddToCart} className="w-full sm:w-auto flex-1 px-8 py-3 bg-[#fd9404] text-white rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <FiShoppingCart />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProductDetailPage;

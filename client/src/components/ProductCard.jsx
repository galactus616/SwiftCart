import React from "react";

const fallbackImg =
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80";

const getCurrencyInfo = (currency) => {
  if (currency === "INR") return { symbol: "₹", rate: 1 / 1.3 };
  return { symbol: "৳", rate: 1 };
};

const ProductCard = ({ product, navigate, addToCart, showToast }) => {
  const [imgError, setImgError] = React.useState(false);
  const [currency, setCurrency] = React.useState(
    localStorage.getItem("swiftcart_currency") || "BDT"
  );
  React.useEffect(() => {
    const handler = (e) => setCurrency(e.detail.currency);
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);
  const { symbol, rate } = getCurrencyInfo(currency);
  const price = (product.price * rate).toFixed(2);

  return (
    <div className="bg-white rounded-xl border border-[#fd9404] shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 font-inter flex flex-col h-full">
      <div
        className="relative w-full h-48 bg-gray-100 flex items-center justify-center cursor-pointer"
        onClick={() =>
          navigate("productDetail", { productId: product.id || product._id })
        }
      >
        <img
          src={!imgError ? product.imageUrl : fallbackImg}
          alt={product.name}
          className="max-h-full max-w-full object-contain rounded-t-xl"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-[#fd9404] mb-1 cursor-pointer transition-colors"
          onClick={() =>
            navigate("productDetail", { productId: product.id || product._id })
          }
        >
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm flex-grow mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-[#fd9404]">
            {symbol} {price}
          </span>
          <button
            onClick={() => {
              addToCart(product);
              showToast("Product added to cart!", "success");
            }}
            className="bg-[#fd9404] text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import useStore from '../store/useStore';

const ProductCard = ({ product }) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const variant = product.variants?.[selectedVariantIdx] || product.variants?.[0] || {};
  const { isLoggedIn, addToCart } = useStore();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="border border-green-100 rounded-2xl p-5 shadow-md  transition-all duration-200 flex flex-col justify-between w-56 bg-white group cursor-pointer">
    <div className="relative border border-gray-100 rounded-xl p-4 flex flex-col w-56 bg-white group transition-all duration-200 hover:shadow-md hover:border-gray-200">
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isBestSeller ? (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            BESTSELLER
          </span>
        ) : product.isFeatured ? (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            FEATURED
          </span>
        ) : null}
      </div>


      {/* Product Image */}
      <div className="flex justify-center items-center h-36 object-fill w-full bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={product.images?.[0] || product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {typeof product.category === 'object' ? product.category.name : product.category}
        </span>
        
        {/* Product Name */}
        <h2 className="text-[15px] font-semibold text-gray-800 leading-tight mt-1 mb-2 line-clamp-2">
          {product.name}
        </h2>

        {/* Variant Selector - Always rendered but with conditional spacing */}
        <div className={hasMultipleVariants ? 'mb-3' : 'mb-1'}>
          {hasMultipleVariants ? (
            <div className="flex gap-1.5 flex-nowrap overflow-x-auto pb-1">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedVariantIdx === idx
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedVariantIdx(idx)}
                >
                  {v.quantityLabel}
                </button>
              ))}
            </div>
          ) : (
            product.variants && (
              <span className="inline-block bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-lg border border-green-600">
                {product.variants[0].quantityLabel}
              </span>
            )
          )}
        </div>

        {/* Add Button */}
        <button className="flex items-center gap-1 text-white bg-green-600 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <Plus className="w-4 h-4" />
          ADD
        </button>
        {/* Price and Add Button Section - horizontal layout at the bottom */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold text-green-700">
                ₹{variant.discountedPrice ?? variant.price}
              </span>
              {variant.discountedPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{variant.price}
                </span>
              )}
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-white bg-green-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            onClick={handleAddToCart}
            >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React from "react";
import { FiShoppingBag, FiBox } from "react-icons/fi";

const fallbackImg =
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80";

const CategoryCard = ({ category, navigate }) => {
  const [imgError, setImgError] = React.useState(false);
  // Use FiShoppingBag for all, FiBox as fallback
  const icon = <FiShoppingBag size={28} className="text-[#fd9404]" />;

  return (
    <div
      onClick={() =>
        navigate("categoryProducts", { categoryName: category.name })
      }
      className="cursor-pointer  bg-white w-32 rounded-xl flex flex-col items-center justify-between text-center group transition-all duration-200  hover:scale-105"
      // style={{ minWidth: 128, minHeight: 176 }}
    >
      <div className="w-16 h-16 mb-2 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative">
        {icon}
        {!imgError && category.imageUrl && (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-10 h-10 object-contain mx-auto absolute top-1 left-1 right-1 bottom-1 m-auto opacity-80 group-hover:opacity-100"
            onError={() => setImgError(true)}
            style={{ zIndex: 1 }}
          />
        )}
      </div>
      <h3 className="text-base font-semibold text-[#fd9404] mt-2 group-hover:text-yellow-500 transition-colors w-[79px] text-ellipsis line-clamp-1 h-6 truncate">
        {category.name}
      </h3>
    </div>
  );
};

export default CategoryCard;

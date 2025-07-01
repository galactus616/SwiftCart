import React, { useState, useEffect, useContext } from "react";
import Toast from "../components/Toast";
import Modal from "../components/Modal";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { generateRecipe as apiGenerateRecipe } from "../api/gemini";

const CartPage = ({ navigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!user) {
      navigate("login");
    }
  }, [user, navigate]);

  const handleCheckout = () => {
    if (getTotalItems() === 0) {
      showToast(
        "Your cart is empty. Please add items before checking out.",
        "error"
      );
      return;
    }
    navigate("checkout");
  };

  const handleRemove = async (productId, productName) => {
    try {
      await removeFromCart(productId);
      showToast(`${productName} removed from cart.`, "success");
    } catch (err) {
      showToast("Failed to remove item. Please try again.", "error");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
      // Toast message can be optional here as UI updates immediately
    } catch (err) {
      showToast("Failed to update quantity. Please try again.", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      showToast("Cart cleared!", "success");
    } catch (err) {
      showToast("Failed to clear cart. Please try again.", "error");
    }
  };

  const handleGenerateRecipe = async () => {
    if (cart.length === 0) {
      showToast(
        "Your cart is empty. Add some items to generate a recipe!",
        "error"
      );
      return;
    }

    setIsGeneratingRecipe(true);
    setGeneratedRecipe(null);
    showToast("Generating recipe...", "success");

    try {
      const ingredientsList = cart
        .map((item) => `${item.quantity} ${item.product.name}`)
        .join(", ");
      const recipeData = await apiGenerateRecipe(ingredientsList);
      setGeneratedRecipe(recipeData);
      setIsRecipeModalOpen(true);
      showToast("Recipe generated!", "success");
    } catch (error) {
      console.error("Error generating recipe:", error);
      showToast(
        error.message || "Error generating recipe. Check console for details.",
        "error"
      );
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen bg-gray-50  font-inter">
        <div className="container mx-auto px-4 py-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-gray-400 mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("home")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Your Shopping Cart ({getTotalItems()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {cart.map((item) => (
              <div
                key={item.product.id || item.product._id}
                className="flex items-center border-b border-gray-100 py-4 last:border-b-0"
              >
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id || item.product._id,
                          item.quantity - 1
                        )
                      }
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
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
                    <span className="mx-3 text-lg font-medium text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id || item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
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
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-700">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() =>
                      handleRemove(
                        item.product.id || item.product._id,
                        item.product.name
                      )
                    }
                    className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 border border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-1"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between items-center">
                <span>Total Items ({getTotalItems()}):</span>
                <span className="font-semibold">${getTotalPrice()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Grand Total:</span>
                <span>${getTotalPrice()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-8 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleGenerateRecipe}
              className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              disabled={isGeneratingRecipe}
            >
              {isGeneratingRecipe && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
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
              )}
              ✨ Generate Recipe
            </button>
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

      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        title="Suggested Recipe"
      >
        {generatedRecipe ? (
          <div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">
              {generatedRecipe.recipeName}
            </h4>
            <h5 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
              Ingredients:
            </h5>
            <ul className="list-disc list-inside space-y-1">
              {generatedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h5 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
              Instructions:
            </h5>
            <ol className="list-decimal list-inside space-y-1">
              {generatedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No recipe generated yet. Add items to your cart and try again!
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CartPage;

import React, { useEffect } from "react";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  MapPin,
  Pencil,
  Trash2,
  X,
  User,
  Plus,
  Minus,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useNavigate, Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import toast from "react-hot-toast";
import useStore from '../../store/useStore';


// Navbar component
export default function Navbar() {
  const navigate = useNavigate();
  // Zustand store hooks
  const {
    user,
    isLoggedIn,
    hydratedItems: cartItems,
    cartLoading,
    cartError,
    fetchProfile,
    logout,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useStore();

  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState("Dumduma, Bhubaneswar, Odisha");
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  // Calculate cart totals
  const cartTotals = React.useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );
    const totalSavings = cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * ((Number(item.originalPrice) || 0) - (Number(item.price) || 0)),
      0
    );
    const deliveryCharge = 0;
    const handlingCharge = 4;
    const grandTotal = itemsTotal + deliveryCharge + (cartItems.length > 0 ? handlingCharge : 0);
    return {
      itemsTotal,
      totalSavings,
      deliveryCharge,
      handlingCharge,
      grandTotal,
    };
  }, [cartItems]);

  // Close all overlays when any is opened
  const closeAllOverlays = () => {
    setIsLocationModalOpen(false);
    setIsProfileDropdownOpen(false);
    setIsCartOpen(false);
  };

  const openLocationModal = () => {
    closeAllOverlays();
    setIsLocationModalOpen(true);
  };

  const toggleProfileDropdown = () => {
    closeAllOverlays();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleCart = () => {
    closeAllOverlays();
    setIsCartOpen(!isCartOpen);
  };

  const handleDetectLocation = () => {
    alert("Detecting your location...");
    setCurrentLocation("Your Detected Location");
    setIsLocationModalOpen(false);
  };

  const handleSaveAddress = (newAddress) => {
    setCurrentLocation(newAddress);
    setIsLocationModalOpen(false);
  };

  const handleProfileMenuItemClick = (item) => {
    alert(`Clicked: ${item}`);
    setIsProfileDropdownOpen(false);
  };

  const handleQuantityChange = (id, delta) => {
    updateCartItem(id, delta);
  };

  // Fetch profile and cart on mount
  useEffect(() => {
    fetchProfile();
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Refetch cart when auth state changes
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  // Profile menu items
  const profileMenuItems = isLoggedIn
    ? [
        { label: "My Orders", action: () => alert("My Orders") },
        { label: "Saved Addresses", action: () => alert("Saved Addresses") },
        { label: "E-Gift Cards", action: () => alert("E-Gift Cards") },
        { label: "FAQ's", action: () => alert("FAQ's") },
        { label: "Account Privacy", action: () => alert("Account Privacy") },
        { label: "Log Out", action: handleLogout, isDestructive: true },
      ]
    : [];

  return (
    <div className="font-sans">
      <nav className="bg-white border-b z-20 border-gray-100 fixed top-0 py-4 px-4 sm:px-6 lg:px-8 w-full shadow-sm">
        <div className="w-full flex flex-wrap items-center justify-between md:flex-nowrap">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 order-1">
            <Link to={'/'} className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg shadow-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
                  <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />
                  <circle cx="9" cy="9" r="1" />
                  <circle cx="15" cy="9" r="1" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-green-700">
                  SwiftCart
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Quick & Fresh
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-3 md:hidden order-2">
            <button
              onClick={toggleProfileDropdown}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              aria-label="Toggle profile menu"
            >
              <User className="w-6 h-6" />
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 text-green-600 hover:bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Location */}
          <div
            className="hidden md:flex flex-col text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 ml-6 order-2 min-w-[200px] p-2 rounded-lg"
            onClick={openLocationModal}
          >
            <span className="font-medium text-green-700">Location</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-medium text-gray-800">
                {currentLocation}
              </span>
              <ChevronDown className="w-4 h-4 ml-1 text-green-600" />
            </div>
          </div>

          {/* Mobile Location */}
          <div
            className="flex flex-col text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 w-full mt-3 md:hidden order-3 p-2 rounded-lg"
            onClick={openLocationModal}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-gray-800">{currentLocation}</span>
              <ChevronDown className="w-4 h-4 ml-1 text-green-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6 w-full md:w-auto mt-3 md:mt-0 order-4 md:order-3 max-w-2xl">
            <div className="relative flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <Search className="absolute left-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Desktop Profile */}
          <div className="relative hidden md:block ml-6 order-4 min-w-[140px]">
            {isLoggedIn && user ? (
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center text-gray-700 cursor-pointer hover:bg-green-50 transition-colors duration-200 p-3 rounded-lg hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full justify-center border border-gray-200 hover:border-green-200"
              >
                <User className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium">
                  {user.name || user.email}
                </span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transform transition-transform duration-200 text-green-600 ${
                    isProfileDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center text-gray-700 cursor-pointer hover:bg-green-50 transition-colors duration-200 p-3 rounded-lg hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full justify-center border border-gray-200 hover:border-green-200"
              >
                <User className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium">Login</span>
              </button>
            )}
            {isLoggedIn && isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-gray-200 border border-gray-100"
                style={{ pointerEvents: 'auto', zIndex: 9999 }}
              >
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={e => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md mx-2 my-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      item.isDestructive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                    tabIndex={0}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Cart Button */}
          <button
            onClick={toggleCart}
            className="relative hidden md:flex items-center bg-green-600 text-white py-3 px-6 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ml-6 order-5 min-w-[140px] justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-medium">My Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Profile Dropdown or Login Button */}
        {!isLoggedIn ? (
          <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center text-gray-700 cursor-pointer hover:bg-green-50 transition-colors duration-200 p-3 rounded-lg hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full justify-center border border-gray-200 hover:border-green-200"
            >
              <User className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-medium">Login</span>
            </button>
          </div>
        ) : (
          isProfileDropdownOpen && (
            <div className="md:hidden mt-4 border-t border-gray-200 pt-4" style={{ pointerEvents: 'auto', zIndex: 9999 }}>
              <div className="flex flex-col space-y-3">
                <div className="pl-6 pb-2 space-y-2 border-l border-gray-200 ml-2">
                  {profileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={e => {
                        e.stopPropagation();
                        console.log('Clicked', item.label);
                        item.action();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        item.isDestructive
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      tabIndex={0}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </nav>

      {/* Profile Dropdown Overlay */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30"
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600/50 z-40 transition-opacity duration-300"
            onClick={() => setIsLocationModalOpen(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Change Location
                </h2>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDetectLocation}
                  className="w-full flex items-center justify-center bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Detect my location
                </button>

                <div className="flex items-center text-gray-500 justify-center">
                  <span className="mx-2">OR</span>
                </div>

                <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-inner-sm">
                  <Search className="absolute left-3 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search delivery location"
                    className="w-full py-3 pl-10 pr-4 bg-transparent text-gray-800 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSaveAddress(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  Your saved addresses
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">Work</p>
                    <p className="text-sm text-gray-600">
                      Floor 2, 64, Opposite of Satgachi board, beside a tea
                      stall there is a small lane Amarpalli, South Dumdum
                    </p>
                    <div className="flex space-x-3 mt-3">
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
                        aria-label="Edit address"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Side Panel */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-600/50 z-40 transition-opacity duration-300"
            onClick={toggleCart}
          ></div>

          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-out ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">My Cart</h2>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartError ? (
                <div className="text-center text-red-600 py-10">{cartError}</div>
              ) : cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Your cart is empty.
                </div>
              ) : (
                <>
                  <div className="bg-green-50 bg-opacity-80 text-green-700 font-medium p-3 rounded-lg flex justify-between items-center text-sm">
                    <span>Your total savings</span>
                    <span>₹{cartTotals.totalSavings.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center bg-blue-50 bg-opacity-80 text-blue-700 p-3 rounded-lg text-sm">
                    <span className="mr-2">📦</span>
                    <span>
                      Shipment of {cartItems.length} item
                      {cartItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ₹{(item.price ?? 0).toFixed(2)}{" "}
                            <span className="line-through text-gray-400">
                              ₹{(item.originalPrice ?? 0).toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="px-3 text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Bill details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Items total</span>
                        <span>₹{cartTotals.itemsTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saved</span>
                        <span className="text-green-600">
                          ₹{cartTotals.totalSavings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery charge</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      {cartItems.length > 0 && (
                        <div className="flex justify-between">
                          <span>Handling charge</span>
                          <span>₹{cartTotals.handlingCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                        <span>Grand total</span>
                        <span>₹{cartItems.length > 0 ? cartTotals.grandTotal.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Tip your delivery partner
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your kindness means a lot! 100% of your tip will go
                      directly to your delivery partner.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[20, 30, 50].map((amount) => (
                        <button
                          key={amount}
                          className="flex-1 min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          ₹{amount}
                        </button>
                      ))}
                      <button className="flex-1 min-w-[80px] py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        Custom
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Cancellation Policy
                    </h3>
                    <p className="text-sm text-gray-600">
                      Orders cannot be cancelled once packed for delivery. In
                      case of unexpected delays, a refund will be provided, if
                      applicable.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 left-0 right-0 shadow-lg">
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-between shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <span className="font-bold text-lg">
                  ₹{cartTotals.grandTotal.toFixed(2)}
                </span>
                <span className="flex items-center">
                  Proceed{" "}
                  <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={async (didLogin) => {
          setIsAuthModalOpen(false);
          if (didLogin) {
            // Re-fetch profile after successful login
            await fetchProfile();
          }
        }}
      />
    </div>
  );
}

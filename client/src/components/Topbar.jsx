import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import {
  FiHome,
  FiGrid,
  FiUser,
  FiShoppingCart,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiClock,
  FiLogOut,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

const navLinks = [
  {
    key: "home",
    label: "Home",
    icon: <FiHome size={20} />,
  },
  {
    key: "categories",
    label: "Categories",
    icon: <FiGrid size={20} />,
  },
  {
    key: "orderHistory",
    label: "Orders",
    icon: <FiClock size={20} />,
  },
  {
    key: "dashboard",
    label: "Profile",
    icon: <FiUser size={20} />,
  },
];

const currencyOptions = [
  { code: "BDT", symbol: "৳" },
  { code: "INR", symbol: "₹" },
];

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState(
    localStorage.getItem("swiftcart_currency") || "BDT"
  );
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on click outside
  const menuRef = useRef();
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  const handleNav = (page) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { page } }));
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("search", { detail: { query: search } })
    );
    setMobileMenuOpen(false);
  };

  const handleCurrencyChange = (code) => {
    setCurrency(code);
    localStorage.setItem("swiftcart_currency", code);
    setCurrencyDropdown(false);
    window.dispatchEvent(
      new CustomEvent("currencyChange", { detail: { currency: code } })
    );
  };

  const selectedCurrency =
    currencyOptions.find((c) => c.code === currency) || currencyOptions[0];

  return (
    <header className="w-full sticky top-0 z-30 bg-white/90 border-b border-gray-100 shadow-sm">
      <div className="w-11/12 md:w-full mx-auto py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => handleNav("home")}
        >
          <FiShoppingCart size={28} className="text-[#fd9404]" />
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            SwiftCart
          </span>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 mx-auto">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNav(link.key)}
              className="group px-3 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-700 font-medium text-base"
              title={link.label}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1 ml-6 w-64 border border-gray-200"
        >
          <FiSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none text-base text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {/* User, Cart, Currency */}
        <div className="flex items-center gap-2 ml-2">
          {/* Currency Switcher (desktop) */}
          <div className="hidden lg:block relative">
            <button
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition"
              onClick={() => setCurrencyDropdown((v) => !v)}
              type="button"
            >
              {selectedCurrency.symbol} {selectedCurrency.code}
              <FiChevronDown size={16} />
            </button>
            {currencyDropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 min-w-[100px]">
                {currencyOptions.map((c) => (
                  <button
                    key={c.code}
                    className={`w-full text-left px-4 py-2 flex hover:bg-gray-50 ${
                      c.code === currency
                        ? "font-bold text-[#fd9404]"
                        : "text-gray-700"
                    }`}
                    onClick={() => handleCurrencyChange(c.code)}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleNav("cart")}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Cart"
            title="Cart"
          >
            <FiShoppingCart size={22} className="text-gray-700" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#fd9404] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {getTotalItems()}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className=" text-gray-700 font-semibold">
                {user.name.split(" ")[0]}
              </span>
              <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-[#fd9404]">
                {user.name[0]}
              </span>

              <button
                onClick={logout}
                className="px-3 py-1 hidden lg:flex bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all ml-2  items-center gap-1"
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav("login")}
                className="px-3 py-1 bg-[#fd9404] text-white rounded-lg font-medium hover:bg-yellow-500 transition-all flex items-center gap-1"
              >
                <FiLogIn className="mr-1" /> Login
              </button>
              <button
                onClick={() => handleNav("register")}
                className="px-3 py-1 border border-[#fd9404] text-[#fd9404] rounded-lg font-medium hover:bg-emerald-50 transition-all flex items-center gap-1"
              >
                <FiUserPlus className="mr-1" /> Register
              </button>
            </>
          )}
          {/* Hamburger for mobile */}
        <button
          className="lg:hidden ml-2 text-2xl text-[#fd9404]"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <FiMenu size={28} />
        </button>
        </div>
        
      </div>
      {/* Mobile Menu + Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            tabIndex={-1}
          />
          {/* Menu */}
          <div
            ref={menuRef}
            className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-lg border-t border-gray-100 rounded-b-2xl z-50 animate-slideDown"
            style={{ animationDuration: "250ms" }}
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 rounded-full px-4 py-2 m-4 border border-gray-200"
            >
              <FiSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-base text-gray-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <nav className="flex flex-row justify-around gap-2 px-4 pb-4">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleNav(link.key)}
                  className="p-2 rounded-full hover:bg-gray-100 transition flex flex-col items-center"
                  title={link.label}
                >
                  {link.icon}
                  <span className="text-xs text-gray-700 mt-1">
                    {link.label}
                  </span>
                </button>
              ))}
              <button
                onClick={() => handleNav("cart")}
                className="relative p-2 rounded-full hover:bg-gray-100 transition flex flex-col items-center"
                title="Cart"
              >
                <FiShoppingCart size={20} className="text-gray-700 mb-1" />
                <span className="text-xs text-gray-700">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#fd9404] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </nav>
            {/* Currency Switcher (mobile) */}
            <div className="flex flex-col gap-2 px-4 pb-4">
              <div className="w-full mb-2">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition justify-center"
                  onClick={() => setCurrencyDropdown((v) => !v)}
                  type="button"
                >
                  {selectedCurrency.symbol} {selectedCurrency.code}
                  <FiChevronDown size={16} />
                </button>
                {currencyDropdown && (
                  <div className="mt-2 bg-white border border-gray-100 rounded-lg shadow-lg z-50 min-w-[100px]">
                    {currencyOptions.map((c) => (
                      <button
                        key={c.code}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          c.code === currency
                            ? "font-bold text-[#fd9404]"
                            : "text-gray-700"
                        }`}
                        onClick={() => handleCurrencyChange(c.code)}
                      >
                        {c.symbol} {c.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all mt-2 flex items-center gap-1 justify-center"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNav("login")}
                    className="w-full px-3 py-2 bg-[#fd9404] text-white rounded-lg font-medium hover:bg-yellow-500 transition-all mt-2 flex items-center gap-1 justify-center"
                  >
                    <FiLogIn className="mr-1" /> Login
                  </button>
                  <button
                    onClick={() => handleNav("register")}
                    className="w-full px-3 py-2 border border-[#fd9404] text-[#fd9404] rounded-lg font-medium hover:bg-emerald-50 transition-all mt-2 flex items-center gap-1 justify-center"
                  >
                    <FiUserPlus className="mr-1" /> Register
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Topbar;

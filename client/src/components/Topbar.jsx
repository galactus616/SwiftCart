import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // ১. Link এবং useNavigate ইম্পোর্ট করুন
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

// ২. navLinks অ্যারেতে URL path যোগ করুন
const navLinks = [
  {
    key: "home",
    label: "Home",
    icon: <FiHome size={20} />,
    path: "/",
  },
  {
    key: "categories",
    label: "Categories",
    icon: <FiGrid size={20} />,
    path: "/categories", // উদাহরণ, আপনার রাউটারে যোগ করতে হবে
  },
  {
    key: "orderHistory",
    label: "Orders",
    icon: <FiClock size={20} />,
    path: "/order-history",
  },
  {
    key: "dashboard",
    label: "Profile",
    icon: <FiUser size={20} />,
    path: "/dashboard",
  },
];

const currencyOptions = [
  { code: "BDT", symbol: "৳" },
  { code: "INR", symbol: "₹" },
];

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate(); // ৩. useNavigate হুক ব্যবহার করুন

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState(
    localStorage.getItem("swiftcart_currency") || "BDT"
  );
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  // ... (বাকি useEffect হুকগুলো অপরিবর্তিত থাকবে)
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

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


  // ৪. handleSearch ফাংশনটিকে আপডেট করুন
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // সার্চ কোয়েরি সহ HomePage-এ নেভিগেট করুন
      navigate(`/?q=${search}`);
    }
    setMobileMenuOpen(false);
  };

  const handleCurrencyChange = (code) => {
    setCurrency(code);
    localStorage.setItem("swiftcart_currency", code);
    setCurrencyDropdown(false);
    window.dispatchEvent(new CustomEvent("currencyChange", { detail: { currency: code } }));
  };

  const selectedCurrency = currencyOptions.find((c) => c.code === currency) || currencyOptions[0];

  return (
    <header className="w-full sticky top-0 z-30 bg-white/90 border-b border-gray-100 shadow-sm">
      <div className="w-11/12 md:w-[97%] mx-auto py-3 flex items-center justify-between">
        {/* ৫. Logo-কে Link কম্পোনেন্ট বানান */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer select-none">
          <FiShoppingCart size={28} className="text-[#fd9404]" />
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            SwiftCart
          </span>
        </Link>
        
        {/* ৬. Desktop Nav-কে Link কম্পোনেন্ট দিয়ে তৈরি করুন */}
        <nav className="hidden lg:flex items-center gap-4 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className="group px-3 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-700 font-medium text-base"
              title={link.label}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1 ml-6 w-64 border border-gray-200">
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
            {/* ... Currency Switcher অপরিবর্তিত ... */}
            <div className="hidden lg:block relative">{/*...*/}</div>

            {/* ৭. Cart বাটনটিকে Link বানান */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition" aria-label="Cart" title="Cart">
              <FiShoppingCart size={22} className="text-gray-700" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fd9404] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* ৮. Login/Register বাটনগুলোকে Link বানান */}
            {user ? (
              <>
                <span className="text-gray-700 font-semibold">{user.name.split(" ")[0]}</span>
                <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-[#fd9404]">{user.name[0]}</span>
                <button onClick={logout} className="px-3 py-1 hidden lg:flex bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all ml-2 items-center gap-1">
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 bg-[#fd9404] text-white rounded-lg font-medium hover:bg-yellow-500 transition-all flex items-center gap-1">
                  <FiLogIn className="mr-1" /> Login
                </Link>
                <Link to="/register" className="px-3 py-1 border border-[#fd9404] text-[#fd9404] rounded-lg font-medium hover:bg-emerald-50 transition-all flex items-center gap-1">
                  <FiUserPlus className="mr-1" /> Register
                </Link>
              </>
            )}

            {/* Hamburger for mobile */}
            <button className="lg:hidden ml-2 text-2xl text-[#fd9404]" onClick={() => setMobileMenuOpen(v => !v)}>
                <FiMenu size={28} />
            </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
            {/* ... (Mobile menu-র ভেতরের কোডও একইভাবে Link দিয়ে পরিবর্তন করতে হবে) ... */}
        </>
      )}
    </header>
  );
};

export default Topbar;

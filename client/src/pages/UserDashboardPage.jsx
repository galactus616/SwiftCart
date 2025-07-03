import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // ১. Link এবং useNavigate ইম্পোর্ট করুন
import { FiUser, FiList, FiEdit, FiLogOut } from "react-icons/fi";

const UserDashboardPage = () => { // ২. navigate prop সরিয়ে দিন
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ৩. useNavigate হুক ব্যবহার করুন

  useEffect(() => {
    if (!user) {
      navigate("/login"); // ৪. সঠিক URL path ব্যবহার করুন
    }
  }, [user, navigate]);

  // যদি user লোড না হয়, তাহলে কিছু রেন্ডার না করে অপেক্ষা করুন
  if (!user) {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate("/"); // লগআউট করার পর হোমপেজে পাঠিয়ে দিন
  }

  const handleEditProfile = () => {
    console.log("Edit Profile functionality would go here! This is a placeholder.");
    // এখানে প্রোফাইল এডিট করার জন্য একটি মডাল বা নতুন পেজ দেখানো যেতে পারে
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b">
            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center text-3xl font-bold">
              {user.name[0]}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Profile Information
          </h3>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              {user.address || "Not set"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone || "Not set"}
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Account Actions
          </h3>
          <div className="flex gap-2">
            {/* ৫. বাটনটিকে Link কম্পোনেন্টে পরিবর্তন করা হয়েছে */}
            <Link
              to="/order-history"
              className="w-full py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiList className="h-5 w-5" />
              My Orders
            </Link>
            <button
              onClick={handleEditProfile}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <FiEdit className="h-5 w-5" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;

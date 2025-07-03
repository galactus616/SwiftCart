import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getOrders as apiGetOrders } from "../api/orders";
import { Link, useNavigate } from "react-router-dom"; // ১. Navigate ইম্পোর্টটি অপ্রয়োজনীয়, তাই সরিয়ে দেওয়া হয়েছে
import { FiLoader, FiChevronLeft } from "react-icons/fi";

const OrderHistoryPage = () => { // ২. navigate prop সরিয়ে দিন
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ৩. useNavigate হুকটি একবারই ব্যবহার করুন
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(orders)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate("/login"); // ৪. সঠিক URL path ব্যবহার করুন
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedOrders = await apiGetOrders();
        // নতুন অর্ডারগুলো প্রথমে দেখানোর জন্য সর্ট করা
        const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter text-gray-700">
        <FiLoader className="animate-spin h-8 w-8 text-[#fd9404]" />
        <p className="ml-4 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter flex items-center justify-center">
        <div className="text-center text-red-600 text-lg p-8 bg-white rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/dashboard" // ৫. বাটনটিকে Link কম্পোনেন্টে পরিবর্তন করা হয়েছে
          className="flex items-center text-gray-600 hover:text-[#fd9404] mb-6 transition-colors w-fit font-semibold"
        >
          <FiChevronLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-700">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/" // ৬. বাটনটিকে Link কম্পোনেন্টে পরিবর্তন করা হয়েছে
              className="mt-6 inline-block px-6 py-3 bg-[#fd9404] text-white rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  Date:{" "}
                  <span className="font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  Total:{" "}
                  <span className="font-medium text-[#fd9404]">
                    ${order.total.toFixed(2)}
                  </span>
                </p>
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">
                    Items:
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {order.items.map((item) => (
                      <li key={item.product?._id || item.productId}>
                        {item.product?.name || 'Product name not available'} x {item.quantity} ($
                        {(item.product?.price * item.quantity).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-gray-600 mb-4">
                  Delivery Address:{" "}
                  <span className="font-medium">{order.deliveryAddress}</span>
                </p>
                <button
                  onClick={() => console.log(`View details for order ${order.orderId}`)}
                  className="w-full py-2 border border-[#fd9404] text-[#fd9404] rounded-lg font-medium hover:bg-yellow-50 transition-all"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

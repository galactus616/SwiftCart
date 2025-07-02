import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const { loading: authLoading } = useContext(AuthContext);

  // অ্যাপ লোড হওয়ার সময় লোডিং স্ক্রিন
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700 text-xl font-inter">
        Loading SwiftCart...
      </div>
    );
  }

  // Contexts গুলো এখানে কাজ করবে এবং Outlet এর মাধ্যমে চাইল্ড রাউটে ডেটা পাঠাবে
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;

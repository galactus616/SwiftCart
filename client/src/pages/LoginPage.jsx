import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ১. useNavigate ইম্পোর্ট করুন
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate(); // ২. হুকটি সঠিকভাবে ব্যবহার করুন
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // যদি ব্যবহারকারী আগে থেকেই লগইন করা থাকে, তাকে হোমপেজে পাঠিয়ে দিন
    if (user) {
      navigate("/"); // ৩. সঠিক URL path ব্যবহার করুন
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      // লগইন সফল হলে হোমপেজে পাঠিয়ে দিন
      navigate("/"); // ৪. পুরনো কোডের বদলে সঠিক URL path দিন
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffa26f] font-sans">
      {/* আপনার বাকি JSX কোড এখানে অপরিবর্তিত থাকবে... */}
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* ... */}
        <div className="absolute bottom-0 left-0 w-full h-[65%] md:h-[70%] bg-[#C1E8FF] rounded-t-[100%] md:rounded-t-[50%]"></div>
        <div className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-8 md:pt-12">
          <header>{/* ... */}</header>
          <main className="w-full flex flex-col items-center justify-center mt-8 md:mt-16 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Welcome!
            </h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              {/* Error and Input fields... */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-gray-600 outline-none py-2 text-lg text-gray-700 placeholder-gray-500 transition-colors"
                />
              </div>
              <div className="mb-8">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-gray-600 outline-none py-2 text-lg text-gray-700 placeholder-gray-500 transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-gray-800 font-bold py-4 px-4 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 text-xl flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Log in'
                )}
              </button>
            </form>
            <div className="w-full max-w-sm mt-12">
              <button 
                onClick={() => navigate("/register")} // ৫. রেজিস্ট্রেশন পেজের জন্য সঠিক URL path
                className="w-full bg-white text-gray-800 font-bold py-4 px-4 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 text-xl"
              >
                Create Account
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

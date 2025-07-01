import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = ({ navigate }) => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("home");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffa26f] font-sans">
      {/* Main container with two-tone background */}
      <div className="relative w-full min-h-screen overflow-hidden">
        
        {/* Upper orange part */}
        <div className="absolute top-0 left-0 w-full h-[45%] md:h-[40%] bg-[#ffa26f]"></div>

        {/* Lower light blue part with curved top */}
        <div className="absolute bottom-0 left-0 w-full h-[65%] md:h-[70%] bg-[#C1E8FF] rounded-t-[100%] md:rounded-t-[50%]"></div>
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-8 md:pt-12">

          {/* Header section with App logo and illustrations */}
          <header className="w-full flex flex-col items-center px-4 md:px-8">
            <div className="w-full flex justify-between items-center max-w-md">
                <img 
                    src="https://i.imgur.com/gAYfJ3h.png" 
                    alt="Shopping cart full of groceries" 
                    className="w-24 h-auto md:w-32"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/F9A826/FFFFFF?text=Cart'; }}
                />
                <div className="bg-[#ffcf6f] p-6 rounded-2xl shadow-lg border-4 border-white">
                    <span className="text-gray-800 text-3xl font-bold">App</span>
                </div>
                <img 
                    src="https://i.imgur.com/uM2y0f8.png" 
                    alt="Person pushing a shopping cart" 
                    className="w-24 h-auto md:w-32"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/F9A826/FFFFFF?text=Shopper'; }}
                />
            </div>
          </header>

          {/* Main content area */}
          <main className="w-full flex flex-col items-center justify-center mt-8 md:mt-16 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Welcome!
            </h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
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
              
              <a href="#" className="block text-sm text-gray-600 mt-4 hover:underline">
                Forgot Password?
              </a>
            </form>

            {/* Create Account Section */}
            <div className="w-full max-w-sm mt-12">
              <button 
                onClick={() => navigate("register")}
                className="w-full bg-white text-gray-800 font-bold py-4 px-4 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 text-xl"
              >
                Create
              </button>

              <p className="mt-4 text-sm text-gray-600">
                Don't Have an Account?{" "}
                <button
                  onClick={() => navigate("register")}
                  className="font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// You would typically export just LoginPage
export default LoginPage;

import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-22 flex-grow ">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      {/* Add padding top equal to navbar height (e.g., 64px) */}
      <main className="flex-grow pt-22">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;

import { Outlet } from 'react-router-dom'; // <-- Outlet ইম্পোর্ট করুন
import Topbar from './Topbar'; // আপনার Topbar কম্পোনেন্ট (যদি থাকে)
// import Footer from './Footer'; // আপনার Footer কম্পোনেন্ট (যদি থাকে)

const Layout = () => {
  return (
    <div className="font-inter bg-gray-50">
      <Topbar />
      
      <main className="min-h-screen">
        {/* এখানে আপনার চাইল্ড পেজ কম্পোনেন্টগুলো রেন্ডার হবে */}
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

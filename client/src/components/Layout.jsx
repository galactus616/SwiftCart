import React from "react";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

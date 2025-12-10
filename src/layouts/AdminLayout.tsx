// import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div
      className="flex min-h-screen min-w-screen flex-col bg-black text-[#f9f906] overflow-x-hidden font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at center, #23230f 0%, #000000 70%)`,
      }}
    >
      <div className="flex">
        <div>
          <Sidebar />
        </div>
        <main className="container mx-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <div
      className="flex h-screen w-screen bg-black text-[#f9f906] overflow-hidden font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at center, #23230f 0%, #000000 70%)`,
      }}
    >
      <div className="shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col justify-between min-h-screen overflow-y-auto">
        <div className="px-4">
          <Outlet />
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

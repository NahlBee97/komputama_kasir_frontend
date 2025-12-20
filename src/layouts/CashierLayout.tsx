// import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const CashierLayout = () => {
  return (
    <div
      className="flex min-h-screen min-w-screen flex-col bg-black text-[#f9f906] overflow-x-hidden font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at center, #23230f 0%, #000000 70%)`,
      }}
    >
      <main className="container mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CashierLayout;

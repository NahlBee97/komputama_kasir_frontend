import { useState } from "react";
import { SearchIcon } from "../components/Icons";
import CartSection from "../components/pos/CartSection";
import LogoutButton from "../components/LogOutButton";
import { useAuth } from "../hooks/useAuth";
import ProductSection from "../components/pos/ProductSection";

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

// --- Components ---

const Pos = () => {
  const { user, logout } = useAuth();

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex h-screen w-full flex-col text-white overflow-hidden bg-[#11110A] font-sans">
      <div className="flex h-full w-full">
        {/* --- Left Column (Menu) --- */}
        <div className="flex flex-col w-[65%] h-full bg-[#11110A] border-r border-r-[#f9f906]/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-b-[#f9f906]/20">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAW_zDxbYU1GJ2Fcl5dsuf3x992q8SyTXZdXj8JUOL6EGBaQakQQ2ruLIof4z239rhkznkUGwCR0fVu-o3ghSBDc11Z_ud02OLsCMPClKQlSDtZ7QbruHX2PBRJyhW9nNKtxn9Pjadd5g3jYwwknEaxFMPnX2IArGqUshqyahDMS62x03kN0v6eM1niLyuwSBaKFEn2CB3jjXMfZAS7nxjNWROjBenNyjNbm8d-ZfP2Pi3IH8lqeEGztDDsTsRWZVNdVxS0bmBvqqg")',
                }}
              ></div>
              <div className="flex flex-col leading-tight">
                <h1 className="text-[#f9f906] uppercase text-lg font-bold leading-normal">
                  Diary Kasir
                </h1>
                <p>{user?.name}</p>
              </div>
            </div>
            {/* Search Bar */}
            <div className="relative w-1/3">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f9f906]/50">
                <SearchIcon />
              </div>
              <input
                className="w-full bg-[#23230f] border border-[#f9f906]/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-[#f9f906]/50 focus:ring-[#f9f906] focus:border-[#f9f906] outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(249,249,6,0.3)]"
                placeholder="Search product..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <LogoutButton onClick={logout} />
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-3 pt-4 px-6">
            <div className="flex border-b border-[#f9f906]/20 gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-2 transition-colors duration-300 ${
                    activeCategory === category
                      ? "border-b-[#f9f906] text-[#f9f906]"
                      : "border-b-transparent text-[#f9f906]/60 hover:text-[#f9f906]"
                  }`}
                >
                  <p className="text-base font-bold leading-normal tracking-[0.015em]">
                    {category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* products */}
          <ProductSection
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </div>

        {/* --- Right Column (Cart) --- */}
        <CartSection />

        
      </div>
    </div>
  );
};

export default Pos;

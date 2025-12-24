import { useState } from "react";
import { SearchIcon } from "../components/Icons";
import CartSection from "../components/pos/CartSection";
import LogoutButton from "../components/LogOutButton";
import { useAuth } from "../hooks/useAuth";
import ProductSection from "../components/pos/ProductSection";
import ProductTab from "../components/pos/ProductTab";

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

const Pos = () => {
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden text-black">
      <div className="flex h-full w-full">
        {/* --- Left Column (Menu) --- */}
        <div className="flex flex-col w-[65%] h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-b-gray-200">
            <div className="flex items-center gap-3">
              <img
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW_zDxbYU1GJ2Fcl5dsuf3x992q8SyTXZdXj8JUOL6EGBaQakQQ2ruLIof4z239rhkznkUGwCR0fVu-o3ghSBDc11Z_ud02OLsCMPClKQlSDtZ7QbruHX2PBRJyhW9nNKtxn9Pjadd5g3jYwwknEaxFMPnX2IArGqUshqyahDMS62x03kN0v6eM1niLyuwSBaKFEn2CB3jjXMfZAS7nxjNWROjBenNyjNbm8d-ZfP2Pi3IH8lqeEGztDDsTsRWZVNdVxS0bmBvqqg"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-black uppercase text-lg font-bold leading-normal">
                  Diary Kasir
                </h1>
                <p>{user?.name}</p>
              </div>
            </div>
            {/* Search Bar */}
            <div className="relative w-1/3">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50">
                <SearchIcon />
              </div>
              <input
                className="w-full bg-white border border-black/10 rounded-lg py-2 pl-10 pr-4 text-black placeholder:text-black/40 focus:ring-black focus:border-black outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(0,0,0,0.08)]"
                placeholder="Cari produk..."
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
          <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-[#f9f906]/20 scrollbar-track-transparent">
            <div className="mb-4">
              <ProductTab
                categories={categories}
                activeCategory={activeCategory}
                onSetCategory={setActiveCategory}
              />
            </div>

            {/* products */}
            <ProductSection
              searchQuery={searchQuery}
              activeCategory={activeCategory}
            />
          </div>
        </div>

        {/* --- Right Column (Cart) --- */}
        <CartSection />
      </div>
    </div>
  );
};

export default Pos;

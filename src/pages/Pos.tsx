import { useState } from "react";
import { SearchIcon } from "../components/Icons";
import CartSection from "../components/pos/CartSection";
import LogoutButton from "../components/LogOutButton";
import { useAuth } from "../hooks/useAuth";
import ProductSection from "../components/pos/ProductSection";
import ProductTab from "../components/pos/ProductTab";
import { useMutation } from "@tanstack/react-query";
import LoadingModal from "../components/LoadingModal";

const categories = ["ATK", "Elektronik"];

const Pos = () => {
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      return await logout();
    },
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white text-[#007ACC]">
      {/* Updated Layout:
        - Changed 'flex' to 'grid grid-cols-3'
        - This creates a 3-column grid system
      */}
      <div className="grid grid-cols-3 h-full w-full">
        {/* --- Left Column (Menu) --- */}
        {/* Takes up 2 out of 3 columns (approx 66%) */}
        <div className="col-span-2 flex flex-col h-full border-r border-[#007ACC]">
          {/* Header */}
          <div className="flex h-20 px-6 items-center justify-between border-b border-[#007ACC]">
            <div className="flex items-center gap-3">
              <img
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 border border-[#007ACC] p-0.5"
                src="/diarylogo.jpeg"
                alt="Profile"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-[#007ACC] uppercase text-lg font-black tracking-tight leading-none">
                  Diary Kasir
                </h1>
                <p className="font-medium text-sm text-[#007ACC]/60">
                  {user?.name}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-1/3">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007ACC]/70">
                <SearchIcon />
              </div>
              <input
                className="w-full bg-white border border-[#007ACC] rounded-full py-2.5 pl-11 pr-5 text-[#007ACC] placeholder:text-[#007ACC]/40 text-sm font-medium focus:outline-none focus:bg-gray-50 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 ease-out"
                placeholder="Cari menu..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <LogoutButton onClick={handleLogout} />
            </div>
          </div>

          {/* Tabs and Products Area */}
          <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-[#007ACC]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#007ACC]/40">
            <div className="mt-6 mb-4">
              <ProductTab
                categories={categories}
                activeCategory={activeCategory}
                onSetCategory={setActiveCategory}
              />
            </div>

            {/* Products Grid */}
            <div className="pb-6">
              <ProductSection
                searchQuery={searchQuery}
                activeCategory={activeCategory}
              />
            </div>
          </div>
        </div>

        {/* --- Right Column (Cart) --- */}
        {/* Takes up 1 out of 3 columns (approx 33%) */}
        <div className="col-span-1 h-full bg-white">
          <CartSection />
        </div>
      </div>
      <LoadingModal isOpen={isPending} message="Keluar..."/>
    </div>
  );
};

export default Pos;

import SaleCard from "../../components/admin/SaleCard";
import { SearchIcon, WarningIcon } from "../../components/Icons";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/orderServices";
import type { Order } from "../../interfaces/orderInterface";
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";
import { getAllUsers } from "../../services/userServices";
import type { User } from "../../interfaces/authInterfaces";

// Helper function to format Date object into YYYY-MM-DD string
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Sales = () => {
  const now = new Date();

  // 1. State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(formatDate(now));
  const [endDate, setEndDate] = useState<string>(formatDate(now));
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined
  );

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // 2. Orders Query
  const {
    data: queryResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", startDate, endDate, page, selectedUserId],
    queryFn: () => getOrders(startDate, endDate, page, selectedUserId),
    staleTime: 1000 * 60 * 5,
  });

  const orders = useMemo(() => queryResult?.orders || [], [queryResult]);
  const totalPages = queryResult?.totalPages || 1;
  const currentPage = queryResult?.currentPage || 1;

  // Client-side filtering for specific ID search (if needed)
  const filteredItems: Order[] = useMemo(() => {
    return orders.length > 0 && searchQuery
      ? orders.filter((order: Order) => order.id === Number(searchQuery))
      : orders;
  }, [searchQuery, orders]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setSearchQuery("");
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedUserId(val ? Number(val) : undefined);
  };

  // --- Styles ---
  const inputContainerClass = "relative w-full sm:w-auto";
  const labelClass =
    "absolute -top-2.5 left-3 bg-white px-1 text-xs font-black uppercase tracking-widest text-[#007ACC]";
  const inputClass =
    "h-12 w-full min-w-[160px] appearance-none rounded-lg border-2 border-[#007ACC] bg-white px-4 text-sm font-bold text-[#007ACC] placeholder-[#007ACC]/30 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200";

  return (
    // Main Container: White bg, [#007ACC] text
    <main className="flex-1 flex flex-col px-4 py-8 md:px-10 bg-white text-[#007ACC] h-full">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-6 mb-8 border-b-2 border-[#007ACC] pb-8">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase">
            Riwayat Penjualan
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Filters Wrapper */}
            <div className="flex flex-wrap items-end gap-4 w-full xl:w-auto">
              {/* Start Date */}
              <div className={inputContainerClass}>
                <label htmlFor="start-date" className={labelClass}>
                  Awal
                </label>
                <input
                  id="start-date"
                  type="date"
                  className={inputClass}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* End Date */}
              <div className={inputContainerClass}>
                <label htmlFor="end-date" className={labelClass}>
                  Akhir
                </label>
                <input
                  id="end-date"
                  type="date"
                  className={inputClass}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Cashier Select */}
              <div className={inputContainerClass}>
                
                <div className="relative">
                  <select
                    id="cashier-select"
                    className={`${inputClass} cursor-pointer`}
                    onChange={handleUserChange}
                  >
                    <option value="">
                      {isLoadingUsers ? "Memuat..." : "SEMUA PETUGAS"}
                    </option>
                    {users.map((user: User) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom Chevron */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#007ACC]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Search Input - Pill Style */}
            <div className="relative w-full md:w-64">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007ACC]/50">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Cari ID..."
                className="w-full bg-white border-2 border-[#007ACC] rounded-full py-3 pl-11 pr-5 text-[#007ACC] placeholder:text-[#007ACC]/40 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
        </header>

        {/* List Content */}
        {!isLoading && !error ? (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 pb-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((order: Order) => (
                  <SaleCard key={order.id} order={order} />
                ))
              ) : (
                <div className="h-60 flex flex-col justify-center items-center gap-4 border-2 border-dashed border-[#007ACC]/20 rounded-xl">
                  <WarningIcon />
                  <p className="text-center font-bold uppercase tracking-wider text-[#007ACC]/40">
                    Riwayat Penjualan Tidak Ditemukan.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Pagination Controls */}
            {totalPages > 1 && !searchQuery && (
              <div className="flex justify-center items-center gap-4 py-6 border-t-2 border-[#007ACC] mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="
                    px-4 py-2 rounded-lg 
                    text-xs font-bold uppercase tracking-wider
                    border-2 border-[#007ACC] bg-white text-[#007ACC]
                    hover:bg-[#007ACC] hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#007ACC]
                    transition-all duration-200
                  "
                >
                  Kembali
                </button>
                <span className="text-[#007ACC] font-bold text-sm">
                  Hal {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="
                    px-4 py-2 rounded-lg 
                    text-xs font-bold uppercase tracking-wider
                    border-2 border-[#007ACC] bg-white text-[#007ACC]
                    hover:bg-[#007ACC] hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#007ACC]
                    transition-all duration-200
                  "
                >
                  Lanjut
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full h-80 items-center justify-center gap-4">
            {error ? <WarningIcon /> : <Loader size="md" variant="dark" />}
            <p className="text-[#007ACC] font-bold uppercase tracking-wider">
              {error ? "Gagal Memuat Data" : "Memuat Data..."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Sales;

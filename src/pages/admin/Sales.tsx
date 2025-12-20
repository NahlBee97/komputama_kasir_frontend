import SaleCard from "../../components/admin/SaleCard";
import { SearchIcon, WarningIcon } from "../../components/Icons";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/orderServices";
import type { Order } from "../../interfaces/orderInterface";
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";

const GLOW_TEXT = "0 0 8px rgba(249, 249, 6, 0.7)";
const GLOW_BORDER_SUBTLE = "0 0 5px rgba(249, f9f9, 6, 0.3)";

// Helper function to format Date object into YYYY-MM-DD string for input default
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  // Ensure month is 1-indexed and padded
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Sales = () => {
  const now = new Date();

  // 1. Add State for Dates and Pagination
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>(formatDate(now));
  const [endDate, setEndDate] = useState<string>(formatDate(now));

  // 2. Update useQuery to include dates and page in the queryKey and queryFn
  const {
    data: queryResult, // Change name to queryResult to hold totalCount and orders
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", startDate, endDate, page], // Key must change to refetch on date/page change
    queryFn: () => getOrders(startDate, endDate, page), // Pass the state to the service function
    // Keep data fresh for 5 minutes (optional)
    staleTime: 1000 * 60 * 5,
  });

  // Destructure orders and totals from the query result
  const orders = useMemo(() => queryResult?.orders || [], [queryResult]);

  const totalPages = queryResult?.totalPages || 1;
  const currentPage = queryResult?.currentPage || 1;

  // Filtering logic remains the same, but operates on the currently fetched page of orders
  const filteredItems: Order[] = useMemo(() => {
    return orders.length > 0 && searchQuery
      ? orders.filter((order: Order) => order.id === Number(searchQuery))
      : orders;
  }, [searchQuery, orders]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    // Only allow changing page if it's within bounds
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Reset search query when changing pages (optional, but usually desired)
      setSearchQuery("");
    }
  };

  return (
    <main className="flex-1 flex flex-col z-10 px-4 py-8 md:px-10">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header */}
        <header className="flex flex-wrap justify-between gap-3 p-4">
          <h1
            className="text-[#f9f906] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
            style={{ textShadow: GLOW_TEXT }}
          >
            RIWAYAT PENJUALAN
          </h1>
        </header>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-6 p-4 items-start md:items-center">
          {/* Date Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative">
              <label
                htmlFor="start-date"
                className="absolute -top-2.5 left-3 bg-[#0A0A0A] px-1 text-xs text-[#f9f906]/80"
              >
                Awal
              </label>
              <input
                id="start-date"
                type="date"
                className="h-10 w-full rounded-md border border-[#f9f906]/50 bg-[#0A0A0A] px-4 text-sm text-[#f9f906] placeholder-transparent outline-none focus:border-[#f9f906] focus:ring-1 focus:ring-[#f9f906] transition-shadow"
                style={{ colorScheme: "dark" }}
                value={startDate} // Controlled input
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1); // Reset to page 1 on date change
                }}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="end-date"
                className="absolute -top-2.5 left-3 bg-[#0A0A0A] px-1 text-xs text-[#f9f906]/80"
              >
                Akhir
              </label>
              <input
                id="end-date"
                type="date"
                className="h-10 w-full rounded-md border border-[#f9f906]/50 bg-[#0A0A0A] px-4 text-sm text-[#f9f906] placeholder-transparent outline-none focus:border-[#f9f906] focus:ring-1 focus:ring-[#f9f906] transition-shadow"
                style={{ colorScheme: "dark" }}
                value={endDate} // Controlled input
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1); // Reset to page 1 on date change
                }}
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f9f906]">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari dengan ID penjualan..."
              className="bg-black border border-[#f9f906]/50 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#f9f906] focus:border-[#f9f906] transition-shadow placeholder-[#f9f906]/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: GLOW_BORDER_SUBTLE }}
              value={searchQuery} // Control the search input
            />
          </div>
        </div>

        {/* List Content */}
        {!isLoading && !error ? (
          <div className="px-4 py-3 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 pb-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((order: Order) => (
                  <SaleCard key={order.id} order={order} />
                ))
              ) : (
                <div className="h-80 flex flex-col justify-center items-center gap-2">
                  <WarningIcon />
                  <p className="text-center text-[#f9f906]/70">
                    Riwayat Penjualan Tidak Ditemukan.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Pagination Controls */}
            {totalPages > 1 && !searchQuery && (
              <div className="flex justify-center items-center gap-4 py-4 mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 text-sm font-medium text-black bg-[#f9f906] rounded-md disabled:opacity-50 transition-colors hover:bg-[#f9f906]/80"
                >
                  Kembali
                </button>
                <span className="text-white">
                  Hal <strong className="text-[#f9f906]">{currentPage}</strong>{" "}
                  dari <strong className="text-[#f9f906]">{totalPages}</strong>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 text-sm font-medium text-black bg-[#f9f906] rounded-md disabled:opacity-50 transition-colors hover:bg-[#f9f906]/80"
                >
                  Lanjut
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full h-70 items-center justify-center">
            <Loader size="md" />
            <p className="text-white mt-4">
              {error ? "Error Getting Orders" : "Loading Orders..."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Sales;

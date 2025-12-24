import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/admin/StatCard";
import { getTopProducts } from "../../services/productServices"; // Needs updating
import { getOrderSummary } from "../../services/orderServices"; // Needs updating
import { useState } from "react"; // Import useState
import TopSelling from "../../components/report/TopSelling";
import { getAllUsers } from "../../services/userServices";
import type { User } from "../../interfaces/authInterfaces";

const GLOW_TEXT = "0 0 2px #f9f906, 0 0 5px #f9f906";

interface OrderSummary {
  totalRevenue: number;
  totalSales: number;
  averageSaleValue: number;
  itemsSold: number;
}

// Helper function to format Date object into YYYY-MM-DD string for input default
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  // Ensure month is 1-indexed and padded
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Report = () => {
  const now = new Date();

  // 1. ADD DATE STATE, initialized to today's date
  const [startDate, setStartDate] = useState<string>(formatDate(now));
  const [endDate, setEndDate] = useState<string>(formatDate(now));

  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined
  );

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // --- TOP PRODUCTS QUERY ---
  const {
    data: topProducts = [],
    isLoading: isTopProductsLoading,
    error: topProductsError,
  } = useQuery({
    // 2. Add date range to queryKey to trigger refetch
    queryKey: ["topProducts", startDate, endDate, selectedUserId],
    // 2. Pass dates to the service function
    queryFn: () => getTopProducts(startDate, endDate, selectedUserId),
  });

  // --- ORDER SUMMARY QUERY ---
  const {
    data: orderSummary = {
      totalRevenue: 0,
      totalSales: 0,
      averageSaleValue: 0,
      itemsSold: 0,
    },
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery<OrderSummary>({
    // 2. Add date range to queryKey to trigger refetch
    queryKey: ["summary", startDate, endDate, selectedUserId],
    // 2. Pass dates to the service function
    queryFn: () => getOrderSummary(startDate, endDate, selectedUserId),
  });

  // 3. HANDLERS to update state and trigger refetch
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    // Logika: Jika value kosong, set undefined (tampilkan semua), jika ada angka set Number
    setSelectedUserId(val ? Number(val) : undefined);
  };

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1
            className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            LAPORAN PENJUALAN
          </h1>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Start Date Input */}
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
                onChange={handleStartDateChange} // Add handler
              />
            </div>

            {/* End Date Input */}
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
                onChange={handleEndDateChange} // Add handler
              />
            </div>

            {/* Cashier Selection */}
            <div className="flex flex-col justify-center items-center gap-2 mb-2">
              <select
                id="cashier-select"
                className="mb-4 p-2 border border-black rounded w-full"
                onChange={handleUserChange}
              >
                <option value="">
                  {isLoadingUsers
                    ? "Memuat data kasir..."
                    : "Pilih Petugas Kasir"}
                </option>
                {users.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid - Remains the same, but now uses data filtered by date state */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <StatCard
            title="TOTAL OMSET"
            // Ensure you are handling the integer-as-cents to dollar conversion here if your backend returns cents!
            value={orderSummary?.totalRevenue}
            isCurrency
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="NILAI PENJUALAN RATA - RATA"
            value={orderSummary.averageSaleValue}
            isCurrency
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="TOTAL ORDER"
            value={orderSummary.totalSales}
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="ITEM TERJUAL"
            value={orderSummary.itemsSold}
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
        </div>

        {/* Top Selling Products Table - Remains the same, but uses data filtered by date state */}
        <div className="mt-10">
          <h2
            className="text-[#f9f906] text-[22px] font-bold leading-tight tracking-[-0.015em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            PRODUK TERLARIS
          </h2>
          <TopSelling
            products={topProducts}
            isLoading={isTopProductsLoading}
            isError={!!topProductsError}
          />
        </div>
      </div>
    </main>
  );
};

export default Report;

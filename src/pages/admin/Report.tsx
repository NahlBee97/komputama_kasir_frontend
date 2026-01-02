import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/admin/StatCard";
import { getTopProducts } from "../../services/productServices";
import { getOrderSummary } from "../../services/orderServices";
import { useState } from "react";
import TopSelling from "../../components/report/TopSelling";
import { getAllUsers } from "../../services/userServices";
import type { User } from "../../interfaces/authInterfaces";

interface OrderSummary {
  totalRevenue: number;
  totalSales: number;
  averageSaleValue: number;
  itemsSold: number;
}

// Helper function to format Date object into YYYY-MM-DD string
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
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
    queryKey: ["topProducts", startDate, endDate, selectedUserId],
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
    queryKey: ["summary", startDate, endDate, selectedUserId],
    queryFn: () => getOrderSummary(startDate, endDate, selectedUserId),
  });

  // 3. HANDLERS
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedUserId(val ? Number(val) : undefined);
  };

  // Shared input class for consistency
  const inputClass =
    "h-12 w-full appearance-none rounded-lg border-2 border-[#007ACC] bg-white px-4 text-sm font-bold text-[#007ACC] placeholder-[#007ACC]/30 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200";
  const labelClass =
    "absolute -top-2.5 left-3 bg-white px-1 text-xs font-black uppercase tracking-widest text-[#007ACC]";

  return (
    // Main Container: White bg, [#007ACC] text
    <main className="flex flex-1 flex-col bg-white text-[#007ACC] min-h-full p-6 lg:p-10">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-8 mb-10 border-b-2 border-[#007ACC] pb-8">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase">
            Laporan Penjualan
          </h1>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-end gap-4 w-full xl:w-auto">
            {/* Start Date Input */}
            <div className="relative w-full sm:w-auto sm:min-w-40">
              <label htmlFor="start-date" className={labelClass}>
                Awal
              </label>
              <input
                id="start-date"
                type="date"
                className={inputClass}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            {/* End Date Input */}
            <div className="relative w-full sm:w-auto sm:min-w-40">
              <label htmlFor="end-date" className={labelClass}>
                Akhir
              </label>
              <input
                id="end-date"
                type="date"
                className={inputClass}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {/* Cashier Selection */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <div className="relative">
                <select
                  id="cashier-select"
                  className={inputClass}
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-2">
            <StatCard
              title="TOTAL OMSET"
              value={orderSummary?.totalRevenue}
              isCurrency
              isLoading={isSummaryLoading}
              isError={!!summaryError}
            />
          </div>
          <div className="col-span-2">
            <StatCard
              title="NILAI RATA - RATA"
              value={orderSummary.averageSaleValue}
              isCurrency
              isLoading={isSummaryLoading}
              isError={!!summaryError}
            />
          </div>
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

        {/* Top Selling Products Table */}
        <div className="mt-12">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-[#007ACC]">
            <span className="h-3 w-3 rounded-full bg-[#007ACC]"></span>
            Produk Terlaris
          </h2>

          {/* Table Container with Neo-Brutalist styling */}
          <div className="overflow-hidden rounded-xl border-2 border-[#007ACC] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <TopSelling
              products={topProducts}
              isLoading={isTopProductsLoading}
              isError={!!topProductsError}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Report;

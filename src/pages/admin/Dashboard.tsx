import { useQuery } from "@tanstack/react-query";
import LowStockTable from "../../components/admin/LowStockTable";
import StatsCard from "../../components/admin/StatCard";
import { getTodayOrders } from "../../services/orderServices";
import { formatCurrency } from "../../helper/formatCurrentcy";
import { getLowStockProducts } from "../../services/productServices";
import type { Order } from "../../interfaces/orderInterface";
import { getAllUsers } from "../../services/userServices";
import { useState } from "react";
import type { User } from "../../interfaces/authInterfaces";

// Removed GLOW constants as they are no longer needed

const Dashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined
  );

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const {
    data: todayOrders = [],
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["todayOrders", selectedUserId],

    queryFn: () => getTodayOrders(selectedUserId),
  });

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: () => getLowStockProducts(),
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedUserId(val ? Number(val) : undefined);
  };

  // order summaries
  const todayTotal = todayOrders.reduce(
    (acc: number, order: Order) => acc + order.totalAmount,
    0
  );
  const totalItemsSold = todayOrders.reduce(
    (acc: number, order: Order) =>
      acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
    0
  );

  return (
    // Main Container: White bg, [#007ACC] text
    <main className="flex flex-1 flex-col bg-white text-[#007ACC] min-h-full">
      <div className="flex-1 p-6 lg:p-10">
        {/* Header Section */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-[#007ACC] pb-8">
          <h1 className="text-[#007ACC] text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase">
            Penjualan Hari Ini
          </h1>

          {/* Cashier Selection */}
          <div className="flex flex-col gap-1 w-full sm:w-auto min-w-60">
            <div className="relative">
              <select
                id="cashier-select"
                className="w-full appearance-none cursor-pointer rounded-lg border-2 border-[#007ACC] bg-white py-3 pl-4 pr-10 font-bold text-[#007ACC] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
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
              {/* Custom Chevron Icon for B&W Theme */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#007ACC]">
                <svg
                  className="h-5 w-5"
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

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="col-span-2">

          <StatsCard
            title="OMSET HARI INI"
            value={formatCurrency(todayTotal)}
            isLoading={isOrderLoading}
            isError={!!orderError}
          />
          </div>
            <StatsCard
              title="JUMLAH TRANSAKSI"
              value={todayOrders.length}
              isLoading={isOrderLoading}
              isError={!!orderError}
            />
            <StatsCard
              title="TOTAL ITEM TERJUAL"
              value={totalItemsSold}
              isLoading={isOrderLoading}
              isError={!!orderError}
            />
        </div>

        {/* Low Stock Alerts */}
        <div className="mt-12">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-[#007ACC]">
            <span className="h-3 w-3 rounded-full bg-[#007ACC]"></span>
            Produk Stok Rendah
          </h2>

          {/* Table Container with B&W styling */}
          <div className="overflow-hidden rounded-xl border-2 border-[#007ACC] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <LowStockTable
              products={products}
              isLoading={isProductsLoading}
              isError={!!productsError}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

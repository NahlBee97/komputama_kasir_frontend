import { useQuery } from "@tanstack/react-query";
import LowStockTable from "../../components/admin/LowStockTable";
import StatsCard from "../../components/admin/StatCard";
import { getTodayOrders } from "../../services/orderServices";
import { formatCurrency } from "../../helper/formatCurrentcy";
import { getLowStockProducts } from "../../services/productServices";
import type { Order } from "../../interfaces/orderInterface";

export const GLOW_BORDER = "0 0 1px #f9f906, 0 0 4px #f9f906, 0 0 8px #f9f906";
export const GLOW_TEXT = "0 0 2px #f9f906, 0 0 5px #f9f906";

const Dashboard = () => {
  const {
    data: todayOrders = [],
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["todayOrders"],
    queryFn: () => getTodayOrders(),
  });

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: () => getLowStockProducts(),
  });

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
    <main className="flex flex-1 flex-col">
      <div className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1
            className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            PENJUALAN HARI INI
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="OMSET HARI INI"
            value={formatCurrency(todayTotal)}
            isLoading={isOrderLoading}
            isError={!!orderError}
          />
          <StatsCard
            title="JUMLAH TRAKSAKSI"
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
        <div className="mt-10">
          <h2
            className="text-[#f9f906] text-[22px] font-bold leading-tight tracking-[-0.015em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            PRODUK STOK RENDAH
          </h2>
          <LowStockTable products={products} isLoading={isProductsLoading} isError={!!productsError} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

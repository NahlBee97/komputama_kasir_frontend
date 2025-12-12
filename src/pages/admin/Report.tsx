import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/admin/StatCard";
import { DownloadIcon } from "../../components/Icons";
import { getTopProducts } from "../../services/productServices";
import type { Product } from "../../interfaces/productInterfaces";
import { formatCurrency } from "../../helper/formatCurrentcy";
import { getOrderSummary } from "../../services/orderServices";

const GLOW_BORDER = "0 0 1px #f9f906, 0 0 4px #f9f906, 0 0 8px #f9f906";
const GLOW_TEXT = "0 0 2px #f9f906, 0 0 5px #f9f906";

interface OrderSummary {
  totalRevenue: number;
  totalSales: number;
  averageSaleValue: number;
  itemsSold: number;
};

const Report = () => {
  const {
    data: topProducts = [],
    isLoading: isTopProductsLoading,
    error: topProductsError,
  } = useQuery({
    queryKey: ["topProducts"],
    queryFn: () => getTopProducts(),
  });

  const {
    data: orderSummary = {totalRevenue: 0, totalSales: 0, averageSaleValue: 0, itemsSold: 0},
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useQuery<OrderSummary>({
    queryKey: ["summary"],
    queryFn: () => getOrderSummary(),
  });

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1
            className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            Sales Report
          </h1>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <label
                htmlFor="start-date"
                className="absolute -top-2.5 left-3 bg-[#0A0A0A] px-1 text-xs text-[#f9f906]/80"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                className="h-10 w-full rounded-md border border-[#f9f906]/50 bg-[#0A0A0A] px-4 text-sm text-[#f9f906] placeholder-transparent outline-none focus:border-[#f9f906] focus:ring-1 focus:ring-[#f9f906] transition-shadow"
                style={{ colorScheme: "dark" }} // Ensures calendar icon is visible in dark mode
                defaultValue="2023-10-01"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="end-date"
                className="absolute -top-2.5 left-3 bg-[#0A0A0A] px-1 text-xs text-[#f9f906]/80"
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                className="h-10 w-full rounded-md border border-[#f9f906]/50 bg-[#0A0A0A] px-4 text-sm text-[#f9f906] placeholder-transparent outline-none focus:border-[#f9f906] focus:ring-1 focus:ring-[#f9f906] transition-shadow"
                style={{ colorScheme: "dark" }}
                defaultValue="2023-10-26"
              />
            </div>
            <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#f9f906] px-5 text-sm font-medium text-black transition-colors hover:bg-yellow-400">
              <DownloadIcon />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="TOTAL REVENUE"
            value={orderSummary?.totalRevenue}
            isCurrency
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="TOTAL SALES"
            value={orderSummary.totalSales}
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="AVG. SALE VALUE"
            value={orderSummary.averageSaleValue}
            isCurrency
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
          <StatCard
            title="ITEMS SOLD"
            value={orderSummary.itemsSold}
            isLoading={isSummaryLoading}
            isError={!!summaryError}
          />
        </div>

        {/* Top Selling Products Table */}
        <div className="mt-10">
          <h2
            className="text-[#f9f906] text-[22px] font-bold leading-tight tracking-[-0.015em]"
            style={{ textShadow: GLOW_TEXT }}
          >
            Top Selling Products
          </h2>
          <div
            className="mt-4 overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
            style={{ boxShadow: GLOW_BORDER }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#f9f906]/20">
                  <tr>
                    <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                      Product Name
                    </th>
                    <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                      Units Sold
                    </th>
                    <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                      Total Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-sm text-white/90">
                        {product.name}
                      </td>
                      <td className="p-4 text-sm text-white/90 text-right">
                        {product.sale}
                      </td>
                      <td className="p-4 text-sm text-white/90 text-right">
                        {formatCurrency(product.sale * product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Report;

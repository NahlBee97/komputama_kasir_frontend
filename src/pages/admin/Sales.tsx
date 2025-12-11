import SaleCard from "../../components/admin/SaleCard";
import { SearchIcon } from "../../components/Icons";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/orderServices";
import type { Order } from "../../interfaces/orderInterface";
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";

const GLOW_TEXT = "0 0 8px rgba(249, 249, 6, 0.7)";
const GLOW_BORDER_SUBTLE = "0 0 5px rgba(249, 249, 6, 0.3)";

const Sales = () => {
const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const filteredItems: Order[] = useMemo(() => {
      return orders.length > 0 && searchQuery
        ? orders.filter(
            (order: Order) =>
              order.id === Number(searchQuery)
          )
        : orders;
    }, [searchQuery, orders]);

  return (
    <main className="flex-1 flex flex-col z-10 px-4 py-8 md:px-10">
      <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto flex-1 h-full">
        {/* Header */}
        <header className="flex flex-wrap justify-between gap-3 p-4">
          <h1
            className="text-[#f9f906] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
            style={{ textShadow: GLOW_TEXT }}
          >
            SALES HISTORY
          </h1>
        </header>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-6 p-4 items-start md:items-center">
          {/* Date Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <label
                htmlFor="from-date"
                className="absolute -top-2.5 left-3 text-xs text-[#f9f906]/80 bg-black px-1"
              >
                From
              </label>
              <input
                id="from-date"
                type="date"
                className="bg-black border border-[#f9f906]/50 text-white rounded-lg px-4 py-2 w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-[#f9f906] focus:border-[#f9f906] transition-shadow placeholder-gray-500"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <label
                htmlFor="to-date"
                className="absolute -top-2.5 left-3 text-xs text-[#f9f906]/80 bg-black px-1"
              >
                To
              </label>
              <input
                id="to-date"
                type="date"
                className="bg-black border border-[#f9f906]/50 text-white rounded-lg px-4 py-2 w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-[#f9f906] focus:border-[#f9f906] transition-shadow placeholder-gray-500"
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
              placeholder="Search by Order ID..."
              className="bg-black border border-[#f9f906]/50 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#f9f906] focus:border-[#f9f906] transition-shadow placeholder-[#f9f906]/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ boxShadow: GLOW_BORDER_SUBTLE }}
            />
          </div>
        </div>

        {/* List Content */}
        {!isLoading && !error ? (
          <div className="px-4 py-3 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 pb-4">
              {filteredItems.map((order: Order) => (
                <SaleCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full h-80 items-center justify-center">
            <Loader size="md" />
            <p>{error ? "Error Getting Orders" : "Loading Orders..."}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Sales;

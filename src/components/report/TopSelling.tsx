import { formatCurrency } from "../../helper/formatCurrentcy";
import type { TopProduct } from "../../interfaces/productInterfaces";
import { GLOW_BORDER } from "../../pages/admin/Dashboard";
import { WarningIcon } from "../Icons";
import Loader from "../Loader";

interface props {
  products: TopProduct[];
  isLoading: boolean;
  isError: boolean;
}

const TopSelling = ({ products, isLoading, isError }: props) => {
  if (isLoading || isError)
    return (
      <div
        className="mt-4 overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto">
          <div className="w-full min-h-80 flex flex-col gap-1 justify-center items-center">
            {isError ? <WarningIcon /> : <Loader size="md" />}
            <p>{isError ? "Error Loading Products" : "Loading Products..."}</p>
          </div>
        </div>
      </div>
    );

  if (products.length === 0)
    return (
      <div
        className="mt-4 overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto">
          <div className="w-full min-h-80 flex flex-col gap-1 justify-center items-center">
            <p>Belum Ada Penjualan</p>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="mt-4 overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
      style={{ boxShadow: GLOW_BORDER }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-[#f9f906]/20">
            {!isLoading && !isError && (
              <tr>
                <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                  # ID
                </th>
                <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                  Nama
                </th>
                <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                  Jumlah Terjual
                </th>
                <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                  Total Omset
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {isLoading || isError ? (
              <tr>
                <td colSpan={3} className="p-10 text-center">
                  <div className="w-full flex flex-col gap-1 justify-center items-center">
                    {isError ? <WarningIcon /> : <Loader size="md" />}
                    <p className="text-white">
                      {isError
                        ? "Error Loading Products"
                        : "Loading Products..."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {products.map((product: TopProduct) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-sm text-white/90">{product.id}</td>
                    <td className="p-4 text-sm text-white/90">
                      {product.name}
                    </td>
                    {/* Assuming the service returns the units sold in a property, e.g., 'unitsSold' */}
                    <td className="p-4 text-sm text-white/90 text-right">
                      {product.totalSold || "N/A"}
                    </td>
                    {/* Assuming the service returns the calculated total revenue */}
                    <td className="p-4 text-sm text-white/90 text-right">
                      {formatCurrency(product.totalSold * product.price)}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSelling;

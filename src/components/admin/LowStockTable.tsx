import type { Product } from "../../interfaces/authInterfaces";
import { GLOW_BORDER } from "../../pages/admin/Dashboard";
import { ErrorIcon, WarningIcon } from "../Icons";

const LowStockTable = ({ data }: { data: Product[] }) => (
  <div
    className="mt-4 overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
    style={{ boxShadow: GLOW_BORDER }}
  >
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-[#f9f906]/20">
          <tr>
            <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
              Id #
            </th>
            <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
              Nama
            </th>
            <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
              Stok Tersisa
            </th>
            <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((product: Product) => (
            <tr key={product.id} className="border-b border-[#f9f906]/10">
              <td className="p-4 text-sm text-white/70">{product.id}</td>
              <td className="p-4 text-sm text-white/90">{product.name}</td>
              <td className="p-4 text-sm text-white/90 text-center">
                {product.stock}
              </td>
              <td className="p-4 text-sm text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <span className="animate-pulse">
                    {product.stock < 5 ? <ErrorIcon /> : <WarningIcon />}
                  </span>

                  <span>{product.stock < 5 ? "Critical" : "Low Stock"}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LowStockTable;

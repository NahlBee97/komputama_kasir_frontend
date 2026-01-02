import { formatCurrency } from "../../helper/formatCurrentcy";
import type { TopProduct } from "../../interfaces/productInterfaces";
import { WarningIcon } from "../Icons";
import Loader from "../Loader";

interface props {
  products: TopProduct[];
  isLoading: boolean;
  isError: boolean;
}

const TopSelling = ({ products, isLoading, isError }: props) => {
  // 1. Loading / Error State
  if (isLoading || isError)
    return (
      <div className="w-full bg-white">
        <div className="w-full min-h-80 flex flex-col gap-4 justify-center items-center">
          {isError ? (
            <WarningIcon  />
          ) : (
            <Loader size="md" variant="dark" />
          )}
          <p className="text-[#007ACC] font-bold uppercase tracking-wider">
            {isError ? "Gagal Memuat Produk" : "Memuat Data Produk..."}
          </p>
        </div>
      </div>
    );

  // 2. Empty State
  if (products.length === 0)
    return (
      <div className="w-full bg-white">
        <div className="w-full min-h-80 flex flex-col gap-2 justify-center items-center">
          <p className="text-[#007ACC] font-black uppercase tracking-widest text-lg">
            Belum Ada Penjualan
          </p>
        </div>
      </div>
    );

  // 3. Data Table
  return (
    <div className="w-full bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header: Solid [#007ACC] for High Contrast */}
          <thead className="bg-[#007ACC] text-white">
            <tr>
              <th className="p-4 text-xs font-black uppercase tracking-widest">
                # ID
              </th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">
                Nama Produk
              </th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-right">
                Jumlah Terjual
              </th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-right">
                Total Omset
              </th>
            </tr>
          </thead>

          {/* Body: White Background, [#007ACC] Text */}
          <tbody className="bg-white text-[#007ACC]">
            {products.map((product: TopProduct) => (
              <tr
                key={product.id}
                className="border-b border-[#007ACC]/10 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-sm font-medium text-[#007ACC]/60">
                  #{product.id}
                </td>
                <td className="p-4 text-sm font-bold uppercase text-[#007ACC]">
                  {product.name}
                </td>
                <td className="p-4 text-sm font-black text-right text-[#007ACC]">
                  {product.totalSold || 0}
                </td>
                <td className="p-4 text-sm font-medium text-right text-[#007ACC]">
                  {formatCurrency(product.totalSold * product.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSelling;

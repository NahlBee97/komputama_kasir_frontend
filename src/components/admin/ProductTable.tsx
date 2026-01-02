import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Product } from "../../interfaces/productInterfaces";
import { DeleteIcon, EditIcon, WarningIcon } from "../Icons";
import Loader from "../Loader";
import StatusBadge from "./StatusBadge";

interface props {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (productId: number) => void;
}

const ProductTable = ({ products, isLoading, isError, onDelete }: props) => {
  const navigate = useNavigate();
  

  // 1. Loading / Error State
  if (isLoading || isError)
    return (
      <div className="w-full bg-white">
        <div className="w-full min-h-80 flex flex-col gap-4 justify-center items-center">
          {isError ? <WarningIcon /> : <Loader size="md" variant="dark" />}
          <p className="text-[#007ACC] font-bold uppercase tracking-wider">
            {isError ? "Gagal Memuat Data" : "Memuat Data Produk..."}
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
            Tidak Ada Produk
          </p>
        </div>
      </div>
    );

  return (
    <table className="w-full text-left border-collapse">
      {/* Header: Solid [#007ACC] for High Contrast */}
      <thead className="bg-[#007ACC] text-white">
        <tr>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest">
            # ID
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest">
            Gambar
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest">
            Nama Produk
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-right">
            Harga
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-right">
            Stok
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-center">
            Status
          </th>
          <th className="py-4 px-4 text-xs font-black uppercase tracking-widest text-center">
            Tindakan
          </th>
        </tr>
      </thead>

      {/* Body: White Background, [#007ACC] Text */}
      <tbody className="bg-white text-[#007ACC]">
        {products.map((product: Product) => (
          <tr
            key={product.id}
            className="border-b border-[#007ACC]/10 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-sm font-medium text-[#007ACC]/60">
              #{product.id}
            </td>
            <td className="p-4">
              <div className="h-12 w-12 rounded-lg border border-[#007ACC] p-0.5 bg-white">
                <img
                  className="h-full w-full rounded-md object-cover"
                  src={product.image as string}
                  alt="product image"
                />
              </div>
            </td>
            <td className="p-4 text-sm font-bold uppercase text-[#007ACC]">
              {product.name}
            </td>
            <td className="p-4 text-sm font-black text-right text-[#007ACC]">
              {formatCurrency(product.price)}
            </td>
            <td className="p-4 text-sm font-medium text-right text-[#007ACC]">
              {product.stock}
            </td>
            <td className="p-4 text-center">
              <StatusBadge stock={product.stock} />
            </td>
            <td className="p-4">
              <div className="flex items-center justify-center gap-2">
                {/* Edit Button: Pill Style */}
                <button
                  className="
                    flex items-center justify-center h-8 w-8 rounded-full 
                    border border-[#007ACC] text-[#007ACC] 
                    hover:bg-[#007ACC] hover:text-white 
                    transition-all duration-200
                  "
                  disabled={isLoading}
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  title="Edit"
                >
                  <EditIcon />
                </button>

                {/* Delete Button: Pill Style */}
                <button
                  className="
                    flex items-center justify-center h-8 w-8 rounded-full 
                    border border-[#007ACC] text-[#007ACC] 
                    hover:bg-[#007ACC] hover:text-white 
                    transition-all duration-200
                  "
                  disabled={isLoading}
                  onClick={() => onDelete(product.id)}
                  title="Delete"
                >
                  <DeleteIcon />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
  );
};

export default ProductTable;

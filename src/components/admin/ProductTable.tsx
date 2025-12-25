import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Product } from "../../interfaces/productInterfaces";
import { DeleteIcon, EditIcon, WarningIcon } from "../Icons";
import Loader from "../Loader";
import StatusBadge from "./StatusBadge";
import { deleteProduct } from "../../services/productServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface props {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

const ProductTable = ({ products, isLoading, isError }: props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteItem, isPending: deletePending } = useMutation({
    mutationFn: async (id: number) => {
      return deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Delete Product Success");
    },
    onError: (error) => {
      alert("Error: " + error);
    },
  });

  // 1. Loading / Error State
  if (isLoading || isError)
    return (
      <div className="w-full bg-white">
        <div className="w-full min-h-80 flex flex-col gap-4 justify-center items-center">
          {isError ? (
            <WarningIcon />
          ) : (
            <Loader size="md" variant="dark" />
          )}
          <p className="text-black font-bold uppercase tracking-wider">
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
          <p className="text-black font-black uppercase tracking-widest text-lg">
            Tidak Ada Produk
          </p>
        </div>
      </div>
    );

  return (
    <table className="w-full text-left border-collapse">
      {/* Header: Solid Black for High Contrast */}
      <thead className="bg-black text-white">
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

      {/* Body: White Background, Black Text */}
      <tbody className="bg-white text-black">
        {products.map((product: Product) => (
          <tr
            key={product.id}
            className="border-b border-black/10 hover:bg-gray-50 transition-colors"
          >
            <td className="p-4 text-sm font-medium text-black/60">
              #{product.id}
            </td>
            <td className="p-4">
              <div className="h-12 w-12 rounded-lg border border-black p-0.5 bg-white">
                <img
                  className="h-full w-full rounded-md object-cover"
                  src={product.image as string}
                  alt="product image"
                />
              </div>
            </td>
            <td className="p-4 text-sm font-bold uppercase text-black">
              {product.name}
            </td>
            <td className="p-4 text-sm font-black text-right text-black">
              {formatCurrency(product.price)}
            </td>
            <td className="p-4 text-sm font-medium text-right text-black">
              {product.stock}
            </td>
            <td className="p-4 text-center">
              <StatusBadge
                stock={product.stock}
              />
            </td>
            <td className="p-4">
              <div className="flex items-center justify-center gap-2">
                {/* Edit Button: Pill Style */}
                <button
                  className="
                    flex items-center justify-center h-8 w-8 rounded-full 
                    border border-black text-black 
                    hover:bg-black hover:text-white 
                    transition-all duration-200
                  "
                  disabled={deletePending}
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  title="Edit"
                >
                  <EditIcon />
                </button>

                {/* Delete Button: Pill Style */}
                <button
                  className="
                    flex items-center justify-center h-8 w-8 rounded-full 
                    border border-black text-black 
                    hover:bg-black hover:text-white 
                    transition-all duration-200
                  "
                  disabled={deletePending}
                  onClick={() => deleteItem(product.id)}
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

import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helper/formatCurrentcy";
import type { Product } from "../../interfaces/productInterfaces";
import { GLOW_TEXT } from "../../pages/admin/Dashboard";
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

  if (isLoading || isError)
    return (
      <div className="overflow-x-auto">
        <div className="w-full min-h-80 flex flex-col gap-1 justify-center items-center">
          {isError ? <WarningIcon /> : <Loader size="md" />}
          <p>{isError ? "Error Memuat Produk" : "Memuat Produk..."}</p>
        </div>
      </div>
    );

  if (products.length === 0)
    return (
      <div className="overflow-x-auto">
        <div className="w-full min-h-80 flex flex-col gap-1 justify-center items-center">
          <p>Tidak Ada Produk</p>
        </div>
      </div>
    );

  return (
    <table className="w-full text-left">
      <thead className="border-b border-[#f9f906]/20">
        {/* Table Headers remain the same */}
        <tr>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
            # ID
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
            Gambar
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
            Nama
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
            Harga
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
            Stok
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
            Status
          </th>
          <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
            Tindakan
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product: Product) => (
          <tr
            key={product.id}
            className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
          >
            {/* Table Cells remain the same */}
            <td className="p-4 text-sm text-white/70">{product.id}</td>
            <td className="p-4 text-sm text-white/90">
              <img
                className="w-10 h-10 rounded-sm object-cover"
                src={product.image as string}
                alt="product image"
              />
            </td>
            <td className="p-4 text-sm text-white/90">{product.name}</td>
            <td className="p-4 text-sm text-white/90 text-right">
              {formatCurrency(product.price)}
            </td>
            <td className="p-4 text-sm text-white/90 text-right">
              {product.stock}
            </td>
            <td className="p-4 text-sm text-center">
              <StatusBadge
                status={
                  product.stock < 10
                    ? product.stock === 0
                      ? "Habis"
                      : "Rendah"
                    : "Cukup"
                }
              />
            </td>
            <td className="p-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  className="text-[#f9f906] hover:text-[#f9f906]/70 transition-all duration-200"
                  style={{ textShadow: GLOW_TEXT }}
                  disabled={deletePending}
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <EditIcon />
                </button>
                <button
                  className="text-[#f9f906] hover:text-[#f9f906]/70 transition-all duration-200"
                  style={{ textShadow: GLOW_TEXT }}
                  disabled={deletePending}
                  onClick={() => deleteItem(product.id)}
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

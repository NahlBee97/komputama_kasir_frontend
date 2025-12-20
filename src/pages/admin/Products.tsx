import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../components/admin/StatusBadge";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  WarningIcon,
} from "../../components/Icons";

import { GLOW_BORDER, GLOW_TEXT } from "./Dashboard";
// Make sure to update your productServices file
import { deleteProduct, getProducts } from "../../services/productServices";
import { formatCurrency } from "../../helper/formatCurrentcy";
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../interfaces/productInterfaces";
import { apiUrl } from "../../config";

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. ADD PAGINATION STATE
  const [page, setPage] = useState<number>(1);

  const queryClient = useQueryClient();

  // 2. UPDATE useQuery for Pagination
  const {
    data: queryResult, // Holds the result object: { products, totalPages, currentPage }
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    // Add page and take to the key to trigger refetch on page change
    queryKey: ["products", page],
    // Pass the pagination parameters to the service function
    queryFn: () => getProducts(page),
  });

  // Extract products and pagination metadata
  const products: Product[] = useMemo(
    () => queryResult?.products || [],
    [queryResult]
  );

  const totalPages: number = queryResult?.totalPages || 1;
  const currentPage: number = queryResult?.currentPage || 1;

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

  const filteredItems: Product[] = useMemo(() => {
    return products.length > 0 && searchQuery
      ? products.filter(
          (product: Product) =>
            product.isActive === true &&
            (product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              product.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) &&
            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : products;
  }, [searchQuery, products]);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Optional: Clear search query on page change if search is global,
      // but since we only filter the current page, keeping it may be fine.
    }
  };

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      {/* Header and Search remain the same */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1
          className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
          style={{ textShadow: GLOW_TEXT }}
        >
          PENGATURAN PRODUK
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f9f906]/70">
              <SearchIcon />
            </div>
            <input
              className="w-full bg-[#23230f] border border-[#f9f906]/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-[#f9f906]/50 focus:ring-[#f9f906] focus:border-[#f9f906] outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(249,249,6,0.3)]"
              placeholder="Cari Produk..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#f9f906] px-4 py-2 text-sm font-bold text-black hover:bg-yellow-400 transition-colors"
            onClick={() => navigate("/admin/products/add")}
          >
            <AddIcon />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div
        className="overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A] flex-1 flex flex-col"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="border-b border-[#f9f906]/20">
              {/* Table Headers remain the same */}
              {!productError && !isProductLoading && (
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
                  <th className="py-4 px-2 text-sm font-semibold uppercase text-[#f9f906]/70">
                    Kategori
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
              )}
            </thead>
            <tbody>
              {isProductLoading || productError ? (
                // Loading/Error state inside the table body
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <div className="flex flex-col h-80 gap-3 justify-center items-center">
                      {productError ? <WarningIcon /> : <Loader size="md" />}
                      <p className="text-white">
                        {productError
                          ? "Error Loading Products"
                          : "Loading Products..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-10 text-center text-[#f9f906]/70"
                  >
                    Produk tidak ditemukan
                  </td>
                </tr>
              ) : (
                <>
                  {filteredItems.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
                    >
                      {/* Table Cells remain the same */}
                      <td className="p-4 text-sm text-white/70">
                        {product.id}
                      </td>
                      <td className="p-4 text-sm text-white/90">
                        <img
                          className="w-10 h-10 rounded-sm object-cover"
                          src={apiUrl + product.image}
                          alt="product image"
                        />
                      </td>
                      <td className="p-4 text-sm text-white/90">
                        {product.name}
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {product.category}
                      </td>
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
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
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
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. PAGINATION CONTROLS */}
        {!isProductLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4 px-4 border-t border-[#f9f906]/20">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-black bg-[#f9f906] rounded-md disabled:opacity-50 transition-colors hover:bg-[#f9f906]/80"
            >
              Kembali
            </button>
            <span className="text-white">
              Hal <strong className="text-[#f9f906]">{currentPage}</strong> dari{" "}
              <strong className="text-[#f9f906]">{totalPages}</strong>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-black bg-[#f9f906] rounded-md disabled:opacity-50 transition-colors hover:bg-[#f9f906]/80"
            >
              Lanjut
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;

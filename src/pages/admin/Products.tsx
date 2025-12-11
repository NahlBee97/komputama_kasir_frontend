import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../components/admin/StatusBadge";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "../../components/Icons";

import { GLOW_BORDER, GLOW_TEXT } from "./Dashboard";
import { deleteProduct, getProducts } from "../../services/productServices";
import { formatCurrency } from "../../helper/formatCurrentcy";
import Loader from "../../components/Loader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../interfaces/productInterfaces";

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

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

  // const handleDelete =

  // Filter items
  const filteredItems: Product[] = useMemo(() => {
    return products.length > 0
      ? products.filter(
          (product: Product) =>
            product.isActive === true &&
            (product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : [];
  }, [searchQuery, products]);

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1
          className="text-[#f9f906] text-4xl font-bold leading-tight tracking-[-0.033em]"
          style={{ textShadow: GLOW_TEXT }}
        >
          Inventory Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f9f906]/70">
              <SearchIcon />
            </div>
            <input
              className="w-full bg-[#23230f] border border-[#f9f906]/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-[#f9f906]/50 focus:ring-[#f9f906] focus:border-[#f9f906] outline-none transition-shadow duration-300 focus:shadow-[0_0_10px_rgba(249,249,6,0.3)]"
              placeholder="Search product..."
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
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div
        className="overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A]"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[#f9f906]/20">
              {!productError && !productLoading && (
                <tr>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                    Image
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                    Product Name
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                    ID
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70">
                    Category
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                    Price
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-right">
                    Stock
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
                    Status
                  </th>
                  <th className="p-4 text-sm font-semibold uppercase text-[#f9f906]/70 text-center">
                    Actions
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {productLoading || productError ? (
                <div className="w-full min-h-screen flex flex-col gap-1 justify-center items-center">
                  <Loader size="md" />
                  <p>
                    {productError
                      ? "Error Loading Products"
                      : "Loading Products..."}
                  </p>
                </div>
              ) : (
                <>
                  {filteredItems.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f9f906]/10 last:border-none hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-sm text-white/90">
                        <img
                          className="w-10 h-10 rounded-sm"
                          src=""
                          alt="product image"
                        />
                      </td>
                      <td className="p-4 text-sm text-white/90">
                        {product.name}
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {product.id}
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
                                ? "Out Of Stock"
                                : "Low Stock"
                              : "In Stock"
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
      </div>
    </main>
  );
};

export default Products;

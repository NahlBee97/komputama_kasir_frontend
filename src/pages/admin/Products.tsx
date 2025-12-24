import { useQuery } from "@tanstack/react-query";
import { AddIcon, SearchIcon } from "../../components/Icons";

import { GLOW_BORDER, GLOW_TEXT } from "./Dashboard";

import { getProducts } from "../../services/productServices";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../interfaces/productInterfaces";
import ProductTable from "../../components/admin/ProductTable";
import ProductTab from "../../components/pos/ProductTab";

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const {
    data: queryResult,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page),
  });

  const products: Product[] = useMemo(
    () => queryResult?.products || [],
    [queryResult]
  );

  const totalPages: number = queryResult?.totalPages || 1;
  const currentPage: number = queryResult?.currentPage || 1;

  const filteredItems: Product[] = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const selectedCategory = activeCategory.toLowerCase();

    return products.filter((product: Product) => {
      const matchesCategory = product.category
        .toLowerCase()
        .includes(selectedCategory);

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <main className="flex flex-1 flex-col p-6 lg:p-10">
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

      {/* 1. TABLE HEADER */}
      <div className="mb-4">
        <ProductTab
          categories={categories}
          activeCategory={activeCategory}
          onSetCategory={setActiveCategory}
        />
      </div>

      {/* Table Container */}
      <div
        className="overflow-hidden rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A] flex-1 flex flex-col"
        style={{ boxShadow: GLOW_BORDER }}
      >
        <div className="overflow-x-auto flex-1">
          <ProductTable
            products={filteredItems}
            isLoading={isProductLoading}
            isError={!!productError}
          />
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

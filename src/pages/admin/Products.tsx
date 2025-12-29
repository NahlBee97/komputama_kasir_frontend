import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddIcon, SearchIcon } from "../../components/Icons";
import { deleteProduct, getProducts } from "../../services/productServices";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../interfaces/productInterfaces";
import ProductTable from "../../components/admin/ProductTable";
import ProductTab from "../../components/pos/ProductTab";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import LoadingModal from "../../components/LoadingModal";
import { handleApiError } from "../../utils/errorHandler";

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number>(0);

  const { mutate: deleteItem, isPending: deletePending } = useMutation({
    mutationFn: async (id: number) => {
      return deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Berhasil menghapus produk");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

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
    // Main Container: White bg, Black text
    <main className="flex flex-1 flex-col bg-white text-black min-h-full p-6 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 mb-4 border-b-2 border-black pb-8">
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase">
          Pengaturan Produk
        </h1>

        <div className="flex w-full items-center justify-between gap-4">
          {/* Search Bar - Pill Shape */}
          <div className="relative w-full md:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
              <SearchIcon />
            </div>
            <input
              className="w-full bg-white border-2 border-black rounded-full py-2.5 pl-11 pr-5 text-black placeholder:text-black/40 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200"
              placeholder="Cari Produk..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Button - Pill Shape & Inverted Hover */}
          <button
            className="
              flex items-center justify-center gap-2 whitespace-nowrap 
              rounded-full bg-black px-6 py-2.5 
              text-sm font-black text-white uppercase tracking-wider
              border-2 border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
              hover:shadow-none hover:translate-y-0.5
              active:scale-95
              transition-all duration-200
            "
            onClick={() => navigate("/admin/products/add")}
          >
            <AddIcon />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* 1. TABLE HEADER (Tabs) */}
      <div className="mb-2">
        <ProductTab
          categories={categories}
          activeCategory={activeCategory}
          onSetCategory={setActiveCategory}
        />
      </div>

      {/* Table Container - Neo Brutalist Border/Shadow */}
      <div className="overflow-hidden rounded-xl border-2 border-black bg-white flex-1 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto flex-1">
          <ProductTable
            products={filteredItems}
            isLoading={isProductLoading}
            isError={!!productError}
            onDelete={(productId) => {
              setProductIdToDelete(productId);
              setIsModalOpen(true);
            }}
          />
        </div>

        {/* 3. PAGINATION CONTROLS */}
        {!isProductLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4 px-4 border-t-2 border-black bg-gray-50">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                px-4 py-2 rounded-lg 
                text-xs font-bold uppercase tracking-wider
                border-2 border-black bg-white text-black
                hover:bg-black hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black
                transition-all duration-200
              "
            >
              Kembali
            </button>
            <span className="text-black font-bold text-sm">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                px-4 py-2 rounded-lg 
                text-xs font-bold uppercase tracking-wider
                border-2 border-black bg-white text-black
                hover:bg-black hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black
                transition-all duration-200
              "
            >
              Lanjut
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        message="Apakah Anda yakin ingin menghapus produk ini?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          deleteItem(productIdToDelete);
          setIsModalOpen(false);
        }}
      />
      <LoadingModal isOpen={deletePending} message="Menghapus produk..." />
    </main>
  );
};

export default Products;

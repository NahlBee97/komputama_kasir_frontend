import { useFormik } from "formik";
import {
  ExpandMoreIcon,
  PhotoCameraIcon,
  WarningIcon,
} from "../../components/Icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { editProductSchema, productSchema } from "../../schemas/productSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productServices";
import type {
  NewProduct,
  UpdateProduct,
} from "../../interfaces/productInterfaces";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import LoadingModal from "../../components/LoadingModal";
import { handleApiError } from "../../utils/errorHandler";
import toast from "react-hot-toast";

const categories = ["ATK", "Elektronik"];

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // Use React Router hook for location

  const pathSegments = location.pathname.split("/");
  const mode = pathSegments.includes("add") ? "add" : "edit";

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: mode === "edit" && !!id,
  });

  useEffect(() => {
    if (mode === "edit" && product?.image && !previewUrl) {
      // eslint-disable-next-line
      setPreviewUrl(product.image);
    }
  }, [mode, product?.image, previewUrl]);

  const { mutate: addProduct, isPending: isAddPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return createProduct(formData);
    },
    onSuccess: () => {
      navigate("/admin/products");
      toast.success("Berhasil menambahkan produk");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const { mutate: editProduct, isPending: isEditPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return updateProduct(product!.id, formData);
    },
    onSuccess: () => {
      navigate("/admin/products");
      toast.success("Berhasil mengedit produk");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const formik = useFormik<NewProduct | UpdateProduct>({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      price: product?.price || "",
      stock: product?.stock || "",
      category: product?.category || categories[0],
    },
    validationSchema: mode === "edit" ? editProductSchema : productSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name as string);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("category", values.category as string);

      if (file) {
        formData.append("file", file);
      } else if (mode === "edit" && product?.image) {
        formData.append("file", product.image);
      }

      if (mode === "add") {
        addProduct(formData);
      } else {
        editProduct(formData);
      }
    },
  });

  const finalPreviewUrl = previewUrl
    ? previewUrl
    : mode === "edit" && product?.image
    ? product.image
    : null;

  // --- Shared B&W Styles ---
  const inputClass =
    "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#007ACC] py-2 focus:outline-0 border-2 border-[#007ACC] bg-white h-14 placeholder:text-[#007ACC]/30 px-4 text-base font-bold transition-all duration-200 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const labelClass =
    "text-[#007ACC] text-sm font-black uppercase tracking-wide pb-2";
  const errorClass = "text-red-600 text-xs font-bold mt-1";

  return (
    // Main Container: Matches AdminLayout padding
    <main className="flex-1 flex flex-col h-full bg-white p-6 lg:p-10">
      <div className="flex justify-center">
        {/* Card Container: Adds the Border + Hard Shadow */}
        <div
          className="w-full max-w-5xl bg-white border-2 border-[#007ACC] rounded-xl p-8"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          {/* Header */}
          <div className="mb-8 border-b-2 border-[#007ACC] pb-6">
            <h1 className="text-[#007ACC] text-4xl font-black leading-tight tracking-tighter uppercase">
              {mode === "add" ? "Tambah" : "Edit"} Produk
            </h1>
          </div>

          {/* Form Content */}
          {isProductLoading || !!productError ? (
            <div className="flex flex-col gap-4 justify-center items-center py-20">
              {productError ? (
                <WarningIcon />
              ) : (
                <Loader size="md" variant="dark" />
              )}
              <p className="text-[#007ACC] font-bold uppercase tracking-wider">
                {productError ? "Gagal Memuat Produk" : "Memuat Data Produk..."}
              </p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column (Inputs) */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Product Name */}
                  <label className="flex flex-col w-full">
                    <p className={labelClass}>Nama Produk</p>
                    <input
                      name="name"
                      className={inputClass}
                      placeholder="Contoh: Print A4"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className={errorClass}>{formik.errors.name}</p>
                    )}
                  </label>

                  {/* Price & Stock Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className={labelClass}>Harga (Rp)</p>
                      <input
                        name="price"
                        type="number"
                        className={inputClass}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.price && formik.errors.price && (
                        <p className={errorClass}>{formik.errors.price}</p>
                      )}
                    </label>
                    <label className="flex flex-col w-full">
                      <p className={labelClass}>Stok Awal</p>
                      <input
                        name="stock"
                        type="number"
                        className={inputClass}
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.stock && formik.errors.stock && (
                        <p className={errorClass}>{formik.errors.stock}</p>
                      )}
                    </label>
                  </div>

                  {/* Category Select */}
                  <label className="flex flex-col w-full">
                    <p className={labelClass}>Kategori</p>
                    <div className="relative">
                      <select
                        name="category"
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {/* Custom Arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#007ACC]">
                        <ExpandMoreIcon />
                      </div>
                    </div>
                    {formik.touched.category && formik.errors.category && (
                      <p className={errorClass}>{formik.errors.category}</p>
                    )}
                  </label>
                </div>

                {/* Right Column (Image Upload) */}
                <div className="md:col-span-1 flex flex-col">
                  <p className={labelClass}>Gambar Produk</p>
                  <label
                    htmlFor="file-upload"
                    className="
                        relative group flex aspect-square w-full cursor-pointer flex-col items-center justify-center 
                        rounded-xl border-2 border-dashed border-[#007ACC] bg-white 
                        hover:bg-gray-50 transition-colors overflow-hidden
                    "
                  >
                    {/* Background Image Preview */}
                    <img
                      src={finalPreviewUrl}
                      alt="Preview"
                      className={`
                            absolute w-full h-full inset-0 bg-cover bg-center object-cover
                            ${!finalPreviewUrl ? "hidden" : "block"}
                        `}
                    />

                    {/* Overlay Content */}
                    <div
                      className={`
                            relative flex flex-col items-center justify-center text-center p-4 w-full h-full
                            ${
                              finalPreviewUrl
                                ? "bg-white/90 opacity-0 group-hover:opacity-100"
                                : "opacity-100"
                            } 
                            transition-all duration-200
                        `}
                    >
                      <div className="text-[#007ACC] scale-125 mb-2">
                        <PhotoCameraIcon />
                      </div>
                      <p className="text-sm font-black uppercase tracking-wide text-[#007ACC]">
                        {mode === "add" && !finalPreviewUrl
                          ? "Upload"
                          : "Ganti"}{" "}
                        Foto
                      </p>
                      <p className="text-xs font-bold text-[#007ACC]/50 mt-1">
                        PNG, JPG
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap justify-end gap-4 border-t-2 border-[#007ACC] pt-6">
                <button
                  type="button"
                  className="
                    flex h-12 min-w-32 cursor-pointer items-center justify-center 
                    rounded-lg bg-white px-6 py-2 
                    text-base font-black uppercase tracking-wider text-[#007ACC] 
                    border-2 border-[#007ACC]
                    hover:bg-[#007ACC] hover:text-white 
                    transition-all duration-200
                  "
                  onClick={() => navigate("/admin/products")}
                  disabled={isAddPending || isEditPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    formik.isSubmitting ||
                    isAddPending ||
                    isEditPending ||
                    (mode === "add" && !file)
                  }
                  className="
                    flex h-12 min-w-32 cursor-pointer items-center justify-center 
                    rounded-lg bg-[#007ACC] px-6 py-2 
                    text-base font-black uppercase tracking-wider text-white
                    border-2 border-[#007ACC]
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    transition-all duration-200
                  "
                >
                  {formik.isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          )}
        </div>
        <LoadingModal
          isOpen={isEditPending || isAddPending}
          message={
            mode === "add" ? "Menambahkan produk..." : "Mengedit produk..."
          }
        />
      </div>
    </main>
  );
};

export default AddEditProduct;

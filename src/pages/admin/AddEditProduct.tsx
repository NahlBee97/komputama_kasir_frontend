import { useFormik } from "formik";
import {
  ExpandMoreIcon,
  PhotoCameraIcon,
  WarningIcon,
} from "../../components/Icons";
import { useNavigate, useParams } from "react-router-dom";
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
import { useState, useEffect } from "react"; // Added useEffect
import { apiUrl } from "../../config";
import Loader from "../../components/Loader";

// ... (Your GLOW_SHADOW and categories constants remain the same) ...
const GLOW_SHADOW_CONTAINER = "0 0 30px rgba(249,249,6,0.3)";
const GLOW_SHADOW_INPUT = "0 0 10px rgba(249,249,6,0.2)";
const TEXT_SHADOW_HEADER = "0 0 10px rgba(249,249,6,0.7)";

const categories = ["Ayam Geprek", "Minuman", "Tambahan"];

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const pathSegments = location.pathname.split("/");
  const mode = pathSegments.includes("add") ? "add" : "edit";

  // State to hold the selected File object and its preview URL
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id], // Added id to queryKey for proper caching
    queryFn: () => getProductById(Number(id)),
    enabled: mode === "edit" && !!id, // Only run if in edit mode and id exists
  });

  // ⭐️ NEW: Set initial preview URL for 'edit' mode
  useEffect(() => {
    if (mode === "edit" && product?.image && !previewUrl) {
      // eslint-disable-next-line
      setPreviewUrl(apiUrl + product.image);
    }
  }, [mode, product?.image, previewUrl]);

  // ⭐️ CHANGE: Mutation now accepts FormData which includes the file
  const { mutate: addProduct, isPending: addPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // Your createProduct service must be updated to accept and handle FormData
      return createProduct(formData);
    },
    onSuccess: () => {
      navigate("/admin/products");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  // ⭐️ CHANGE: Mutation now accepts FormData which includes the file
  const { mutate: editProduct, isPending: editPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // Your updateProduct service must be updated to accept and handle FormData
      return updateProduct(product!.id, formData);
    },
    onSuccess: () => {
      navigate("/admin/products");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  // Function to handle file input change (ALREADY CORRECT)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Create a local URL for image preview
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const formik = useFormik<NewProduct | UpdateProduct>({
    enableReinitialize: true,
    initialValues: {
      name: mode === "edit" ? product?.name : "",
      price: mode === "edit" ? product?.price : 0,
      stock: mode === "edit" ? product?.stock : 0,
      category: mode === "edit" ? product?.category : categories[0],
    },
    validationSchema: mode === "edit" ? editProductSchema : productSchema,
    // ⭐️ CHANGE: Updated onSubmit to use FormData and include the file
    onSubmit: async (values) => {
      // 1. Create FormData object
      const formData = new FormData();

      // 2. Append all form values
      formData.append("name", values.name as string);
      formData.append("price", String(values.price)); // Convert to string for FormData
      formData.append("stock", String(values.stock));
      formData.append("category", values.category as string);

      // 3. Append the image file if selected
      if (file) {
        formData.append("file", file); // 'productImage' is the key your server will look for
      }
      // 4. Handle existing image URL for edit mode if no new file is uploaded
      else if (mode === "edit" && product?.image) {
        formData.append("file", product.image); // Pass the old URL if no change
      }

      // 5. Call the appropriate mutation with FormData
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
    : "";

  return (
    <main className="flex-1 layout-container flex h-full grow flex-col">
      <div className="flex flex-1 justify-center items-center py-10 px-4">
        <div
          className="layout-content-container flex flex-col w-full max-w-4xl p-8 bg-[#0A0A0A] border border-[#f9f906] rounded-xl"
          style={{ boxShadow: GLOW_SHADOW_CONTAINER }}
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <h1
              className="text-[#f9f906] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
              style={{ textShadow: TEXT_SHADOW_HEADER }}
            >
              {mode === "add" ? "TAMBAH" : "EDIT"} PRODUK
            </h1>
          </div>

          {/* Form Grid */}
          {isProductLoading || !!productError ? (
            <div className="flex flex-col gap-3 justify-center items-center">
              {productError ? <WarningIcon /> : <Loader size="md" />}
              <p className="text-white">
                {productError
                  ? "Error Loading Products"
                  : "Loading Products..."}
              </p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column (Inputs) - NO CHANGES HERE */}
                {/* ... (Your left column inputs for name, price, stock, category) ... */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Product Name */}
                  <label className="flex flex-col w-full">
                    <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                      Nama
                    </p>
                    <input
                      name="name"
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 p-[15px] text-base font-normal leading-normal"
                      style={{ boxShadow: GLOW_SHADOW_INPUT }}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.name}
                      </p>
                    )}
                  </label>

                  {/* Price & Stock Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                        Harga
                      </p>
                      <input
                        name="price"
                        type="number"
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 p-[15px] text-base font-normal leading-normal"
                        style={{ boxShadow: GLOW_SHADOW_INPUT }}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.price && formik.errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.price}
                        </p>
                      )}
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                        Stok
                      </p>
                      <input
                        name="stock"
                        type="number"
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 p-[15px] text-base font-normal leading-normal"
                        style={{ boxShadow: GLOW_SHADOW_INPUT }}
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.stock && formik.errors.stock && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.stock}
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Category Select */}
                  <label className="flex flex-col w-full">
                    <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                      Kategori
                    </p>
                    <div className="relative">
                      <select
                        name="category"
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 px-[15px] text-base font-normal leading-normal appearance-none cursor-pointer"
                        style={{ boxShadow: GLOW_SHADOW_INPUT }}
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#f9f906]">
                        <ExpandMoreIcon />
                      </div>
                    </div>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.category}
                      </p>
                    )}
                  </label>
                </div>

                {/* Right Column (Image Upload) - ⭐️ CHANGES HERE */}
                <div className="md:col-span-1 flex flex-col">
                  <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                    Gambar
                  </p>
                  {/* Wrap the clickable area with a label to connect it to the hidden input */}
                  <label
                    htmlFor="file-upload" // Connects to the input below
                    className="relative group flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#f9f906]/50 hover:border-[#f9f906] transition-colors bg-[#000000] overflow-hidden"
                    style={{ boxShadow: GLOW_SHADOW_INPUT }}
                  >
                    {/* Image Preview */}
                    {/* ⭐️ Use finalPreviewUrl for the background image */}
                    <img
                      src={finalPreviewUrl}
                      className="absolute w-full h-full inset-0 bg-cover bg-center group-hover:opacity-20 transition-opacity"
                    />
                    <div
                      className={`relative flex flex-col items-center justify-center text-center p-4 ${
                        finalPreviewUrl ? "opacity-20" : "opacity-60"
                      } group-hover:opacity-100 transition-opacity`}
                    >
                      <div className="text-[#f9f906] ">
                        <PhotoCameraIcon />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#f9f906]">
                        {mode === "add" && !finalPreviewUrl
                          ? "Tambah"
                          : "Ganti"}{" "}
                        Gambar
                      </p>
                      <p className="text-xs text-[#f9f906]">PNG, JPG, GIF</p>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange} // Existing handler is correct
                        accept="image/*"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              {/* ... (Your action buttons remain the same) ... */}
              <div className="mt-10 flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  className="flex h-12 min-w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#0A0A0A] px-6 py-2 text-base font-bold text-[#f9f906] ring-2 ring-[#f9f906] transition-all hover:bg-[#f9f906]/10"
                  onClick={() => navigate("/admin/products")}
                  disabled={addPending || editPending}
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  // The form is ready to submit if either file is present (add) or form has changes (edit)
                  disabled={
                    formik.isSubmitting ||
                    addPending ||
                    editPending ||
                    (mode === "add" && !file)
                  }
                  className="flex h-12 min-w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f9f906] px-6 py-2 text-base font-bold text-[#0A0A0A] transition-all hover:brightness-110 shadow-[0_0_15px_rgba(249,249,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddEditProduct;

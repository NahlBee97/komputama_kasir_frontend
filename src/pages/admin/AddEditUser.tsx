import { useFormik } from "formik";
import { ExpandMoreIcon, WarningIcon } from "../../components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import type { NewUser, UpdateUser } from "../../interfaces/userInterfaces";
import { createUser, getUserById, updateUser } from "../../services/userServices";
import { editUserSchema, userSchema } from "../../schemas/userSchema";

// ... (Your GLOW_SHADOW and shifts constants remain the same) ...
const GLOW_SHADOW_CONTAINER = "0 0 30px rgba(249,249,6,0.3)";
const GLOW_SHADOW_INPUT = "0 0 10px rgba(249,249,6,0.2)";
const TEXT_SHADOW_HEADER = "0 0 10px rgba(249,249,6,0.7)";

const shifts = ["Siang", "Malam"];

const AddEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const pathSegments = location.pathname.split("/");
  const mode = pathSegments.includes("add") ? "add" : "edit";

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", id], // Added id to queryKey for proper caching
    queryFn: () => getUserById(Number(id)),
    enabled: mode === "edit" && !!id, // Only run if in edit mode and id exists
  });

  // ⭐️ CHANGE: Mutation now accepts FormData which includes the file
  const { mutate: addUser, isPending: addPending } = useMutation({
    mutationFn: async (data: NewUser) => {
      // Your createUser service must be updated to accept and handle FormData
      return createUser(data);
    },
    onSuccess: () => {
      navigate("/admin/users");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  // ⭐️ CHANGE: Mutation now accepts FormData which includes the file
  const { mutate: editUser, isPending: editPending } = useMutation({
    mutationFn: async (data: UpdateUser) => {
      // Your updateProduct service must be updated to accept and handle FormData
      return updateUser(user!.id, data);
    },
    onSuccess: () => {
      navigate("/admin/users");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const formik = useFormik<NewUser | UpdateUser>({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      pin: user?.pin || "",
      shift: user?.shift ? user.shift === "DAY" ? "Siang" : "Malam" : shifts[0],
    },
    validationSchema: mode === "edit" ? editUserSchema : userSchema,
    // ⭐️ CHANGE: Updated onSubmit to use FormData and include the file
    onSubmit: async (values) => {
      if (mode === "add") {
        addUser(values as NewUser);
      } else {
        editUser(values as UpdateUser);
      }
    },
  });

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
              {mode === "add" ? "TAMBAH" : "EDIT"} PETUGAS KASIR
            </h1>
          </div>

          {/* Form Grid */}
          {isUserLoading || !!userError ? (
            <div className="flex flex-col gap-3 justify-center items-center">
              {userError ? <WarningIcon /> : <Loader size="md" />}
              <p className="text-white">
                {userError
                  ? "Error Loading users"
                  : "Loading users..."}
              </p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 gap-8">
                {/* Left Column (Inputs) - NO CHANGES HERE */}
                {/* ... (Your left column inputs for name, price, stock, shift) ... */}
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

                  <label className="flex flex-col w-full">
                    <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                      PIN
                    </p>
                    <input
                      name="pin"
                      type="password"
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 p-[15px] text-base font-normal leading-normal"
                      style={{ boxShadow: GLOW_SHADOW_INPUT }}
                      value={formik.values.pin}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.pin && formik.errors.pin && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.pin}
                      </p>
                    )}
                  </label>

                  {/* Shift Select */}
                  <label className="flex flex-col w-full">
                    <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
                      Shift
                    </p>
                    <div className="relative">
                      <select
                        name="shift"
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906]/50 border border-[#f9f906]/50 bg-[#000000] h-14 placeholder:text-[#f9f906]/50 px-[15px] text-base font-normal leading-normal appearance-none cursor-pointer"
                        style={{ boxShadow: GLOW_SHADOW_INPUT }}
                        value={formik.values.shift}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {shifts.map((shift) => (
                          <option key={shift} value={shift}>
                            {shift}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#f9f906]">
                        <ExpandMoreIcon />
                      </div>
                    </div>
                    {formik.touched.shift && formik.errors.shift && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.shift}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              {/* ... (Your action buttons remain the same) ... */}
              <div className="mt-10 flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  className="flex h-12 min-w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#0A0A0A] px-6 py-2 text-base font-bold text-[#f9f906] ring-2 ring-[#f9f906] transition-all hover:bg-[#f9f906]/10"
                  onClick={() => navigate("/admin/users")}
                  disabled={addPending || editPending}
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  // The form is ready to submit if either file is present (add) or form has changes (edit)
                  disabled={formik.isSubmitting || addPending || editPending}
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

export default AddEditUser;

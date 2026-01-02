import { useFormik } from "formik";
import { ExpandMoreIcon, WarningIcon } from "../../components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import type { UpdateUser } from "../../interfaces/userInterfaces";
import { getUserById, updateUser } from "../../services/userServices";
import { editUserSchema } from "../../schemas/userSchema";
import LoadingModal from "../../components/LoadingModal";

const shifts = ["Siang", "Malam"];

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(Number(id)),
  });

  const { mutate: editUser, isPending: isEditPending } = useMutation({
    mutationFn: async (data: UpdateUser) => {
      return updateUser(user!.id, data);
    },
    onSuccess: () => {
      navigate("/admin/users");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const formik = useFormik<UpdateUser>({
    enableReinitialize: true,
    initialValues: {
      name: user?.name,
      shift: user?.shift
        ? user.shift === "DAY"
          ? "Siang"
          : "Malam"
        : shifts[0],
    },
    validationSchema: editUserSchema,
    onSubmit: async (values) => {
      editUser(values as UpdateUser);
    },
  });

  // --- Shared B&W Styles ---
  const inputClass =
    "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#007ACC] py-2 focus:outline-0 border-2 border-[#007ACC] bg-white h-14 placeholder:text-[#007ACC]/30 px-4 text-base font-bold transition-all duration-200 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const labelClass =
    "text-[#007ACC] text-sm font-black uppercase tracking-wide pb-2";
  const errorClass = "text-red-600 text-xs font-bold mt-1 uppercase";

  return (
    // Main Container
    <main className="flex-1 flex flex-col h-full bg-white p-6 lg:p-10">
      <div className="flex justify-center">
        {/* Card Container */}
        <div
          className="w-full max-w-2xl bg-white border-2 border-[#007ACC] rounded-xl p-8"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          {/* Header */}
          <div className="mb-8 border-b-2 border-[#007ACC] pb-6">
            <h1 className="text-[#007ACC] text-4xl font-black leading-tight tracking-tighter uppercase">
              Edit Petugas
            </h1>
          </div>

          {/* Form Content */}
          {isUserLoading || !!userError ? (
            <div className="flex flex-col gap-4 justify-center items-center py-20">
              {userError ? (
                <WarningIcon />
              ) : (
                <Loader size="md" variant="dark" />
              )}
              <p className="text-[#007ACC] font-bold uppercase tracking-wider">
                {userError ? "Gagal Memuat Data" : "Memuat Data User..."}
              </p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Name Input */}
                <label className="flex flex-col w-full">
                  <p className={labelClass}>Nama Petugas</p>
                  <input
                    name="name"
                    className={inputClass}
                    placeholder="Contoh: Kasir 1"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className={errorClass}>{formik.errors.name}</p>
                  )}
                </label>

                {/* Shift Select */}
                <label className="flex flex-col w-full">
                  <p className={labelClass}>Shift Kerja</p>
                  <div className="relative">
                    <select
                      name="shift"
                      className={`${inputClass} appearance-none cursor-pointer`}
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
                    {/* Custom Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#007ACC]">
                      <ExpandMoreIcon />
                    </div>
                  </div>
                  {formik.touched.shift && formik.errors.shift && (
                    <p className={errorClass}>{formik.errors.shift}</p>
                  )}
                </label>

                <button
                  type="button"
                  className="
                    flex h-12 min-w-32 cursor-pointer items-center justify-center 
                    rounded-lg bg-white px-6 py-2 self-start
                    text-base font-black tracking-wider text-[#007ACC] 
                    border-2 border-[#007ACC]
                    hover:bg-[#007ACC] hover:text-white 
                    transition-all duration-200
                  "
                  onClick={() => navigate(`/admin/users/pin/${id}`)}
                >
                  Ganti PIN Akses?
                </button>
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
                  onClick={() => navigate("/admin/users")}
                  disabled={isEditPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting || isEditPending}
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
        <LoadingModal isOpen={isEditPending} message="Mengedit kasir..." />
      </div>
    </main>
  );
};

export default EditUser;

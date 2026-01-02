import { useFormik } from "formik";
import { ExpandMoreIcon } from "../../components/Icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { NewUser } from "../../interfaces/userInterfaces";
import { createUser } from "../../services/userServices";
import { userSchema } from "../../schemas/userSchema";
import LoadingModal from "../../components/LoadingModal";

const shifts = ["Siang", "Malam"];

const AddUser = () => {
  const navigate = useNavigate();

  const { mutate: addUser, isPending: isAddPending } = useMutation({
    mutationFn: async (data: NewUser) => {
      return createUser(data);
    },
    onSuccess: () => {
      navigate("/admin/users");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const formik = useFormik<NewUser>({
    enableReinitialize: true,
    initialValues: {
      name: "",
      pin: "",
      shift: shifts[0],
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      addUser(values as NewUser);
    },
  });

  // --- Shared B&W Styles ---
  const inputClass =
    "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black py-2 focus:outline-0 border-2 border-black bg-white h-14 placeholder:text-black/30 px-4 text-base font-bold transition-all duration-200 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const labelClass =
    "text-black text-sm font-black uppercase tracking-wide pb-2";
  const errorClass = "text-red-600 text-xs font-bold mt-1 uppercase";

  return (
    // Main Container
    <main className="flex-1 flex flex-col h-full bg-white p-6 lg:p-10">
      <div className="flex justify-center">
        {/* Card Container */}
        <div
          className="w-full max-w-2xl bg-white border-2 border-black rounded-xl p-8"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          {/* Header */}
          <div className="mb-8 border-b-2 border-black pb-6">
            <h1 className="text-black text-4xl font-black leading-tight tracking-tighter uppercase">
              Tambah Petugas
            </h1>
          </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PIN Input */}
                <label className="flex flex-col w-full">
                  <p className={labelClass}>PIN Akses</p>
                  <input
                    name="pin"
                    type="password" // Hidden for security, or text if you prefer visibility
                    maxLength={6} // Assuming 6 digit pin
                    className={inputClass}
                    placeholder="******"
                    value={formik.values.pin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.pin && formik.errors.pin && (
                    <p className={errorClass}>{formik.errors.pin}</p>
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                      <ExpandMoreIcon />
                    </div>
                  </div>
                  {formik.touched.shift && formik.errors.shift && (
                    <p className={errorClass}>{formik.errors.shift}</p>
                  )}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap justify-end gap-4 border-t-2 border-black pt-6">
              <button
                type="button"
                className="
                    flex h-12 min-w-32 cursor-pointer items-center justify-center 
                    rounded-lg bg-white px-6 py-2 
                    text-base font-black uppercase tracking-wider text-black 
                    border-2 border-black
                    hover:bg-black hover:text-white 
                    transition-all duration-200
                  "
                onClick={() => navigate("/admin/users")}
                disabled={isAddPending}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || isAddPending}
                className="
                    flex h-12 min-w-32 cursor-pointer items-center justify-center 
                    rounded-lg bg-black px-6 py-2 
                    text-base font-black uppercase tracking-wider text-white
                    border-2 border-black
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
        </div>
        <LoadingModal isOpen={isAddPending} message="Menambahkan kasir..." />
      </div>
    </main>
  );
};

export default AddUser;

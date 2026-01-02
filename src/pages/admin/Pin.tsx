import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { SetPin } from "../../interfaces/userInterfaces";
import { updateUser } from "../../services/userServices";
import { setPinSchema } from "../../schemas/userSchema";
import LoadingModal from "../../components/LoadingModal";
import { EyeClosedIcon, EyeOpenIcon } from "../../components/Icons";

const Pin = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const { mutate: editUser, isPending: isEditPending } = useMutation({
    mutationFn: async (data: SetPin) => {
      return updateUser(Number(id), data);
    },
    onSuccess: () => {
      navigate("/admin/users");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const formik = useFormik<SetPin>({
    enableReinitialize: true,
    initialValues: {
      pin: "",
      confirmPin: "",
    },
    validationSchema: setPinSchema,
    onSubmit: async (values) => {
      editUser(values as SetPin);
    },
  });

  // --- Shared B&W Styles ---
  // Added 'pr-12' to make room for the eye icon so text doesn't overlap
  const inputClass =
    "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black py-2 focus:outline-0 border-2 border-black bg-white h-14 placeholder:text-black/30 px-4 pr-12 text-base font-bold transition-all duration-200 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const labelClass =
    "text-black text-sm font-black uppercase tracking-wide pb-2";
  const errorClass = "text-red-600 text-xs font-bold mt-1";

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
              Ganti Pin Akses
            </h1>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* New PIN */}
              <label className="flex flex-col w-full relative">
                <p className={labelClass}>PIN Baru</p>

                {/* Wrapper div for positioning the icon */}
                <div className="relative w-full">
                  <input
                    name="pin"
                    // 3. Toggle type based on state
                    type={showPin ? "text" : "password"}
                    className={inputClass}
                    placeholder="******"
                    value={formik.values.pin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {/* 4. Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                  >
                    {showPin ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>

                {formik.touched.pin && formik.errors.pin && (
                  <p className={errorClass}>{formik.errors.pin}</p>
                )}
              </label>

              {/* Confirm PIN */}
              <label className="flex flex-col w-full">
                <p className={labelClass}>Konfirmasi PIN Baru</p>

                {/* Wrapper div for positioning the icon */}
                <div className="relative w-full">
                  <input
                    name="confirmPin"
                    // 5. Toggle type based on state
                    type={showConfirmPin ? "text" : "password"}
                    className={inputClass}
                    placeholder="******"
                    value={formik.values.confirmPin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {/* 6. Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                  >
                    {showConfirmPin ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>

                {formik.touched.confirmPin && formik.errors.confirmPin && (
                  <p className={errorClass}>{formik.errors.confirmPin}</p>
                )}
              </label>
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
                disabled={isEditPending}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || isEditPending}
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
        <LoadingModal isOpen={isEditPending} message="Menganti PIN Akses..." />
      </div>
    </main>
  );
};

export default Pin;

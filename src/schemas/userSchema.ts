import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  name: Yup.string().required("Nama pengguna wajib diisi"),
  pin: Yup.string()
    .matches(/^[0-9]+$/, "PIN harus berupa angka") // Ensures only numbers
    .length(6, "PIN harus 6 angka") // Ensures exactly 6 digits
    .required("PIN wajib diisi"),
  shift: Yup.string().required("Shift wajib diisi"),
});

export const editUserSchema = Yup.object().shape({
  name: Yup.string().optional(),
  shift: Yup.string().optional(),
});

export const setPinSchema = Yup.object().shape({
  pin: Yup.string()
    .matches(/^[0-9]+$/, "PIN harus berupa angka")
    .length(6, "PIN harus 6 angka")
    .required("PIN Baru wajib diisi"), // Changed from optional to required
  confirmPin: Yup.string()
    .required("Konfirmasi PIN wajib diisi")
    .oneOf([Yup.ref("pin")], "PIN tidak cocok"),
});

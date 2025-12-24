import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  name: Yup.string().required("User name is required"),
  pin: Yup.number()
    .typeError("PIN must be a number")
    .positive("PIN must be positive")
    .required("PIN is required"),
  shift: Yup.string().required("Shift is required"),
});

export const editUserSchema = Yup.object().shape({
  name: Yup.string().optional(),
  pin: Yup.number()
    .typeError("PIN must be a number")
    .positive("PIN must be positive")
    .optional(),
  shift: Yup.string().optional(),
});

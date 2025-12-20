import * as Yup from "yup";

export const productSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  category: Yup.string().required("Category is required"),
});

export const editProductSchema = Yup.object().shape({
  name: Yup.string().optional(),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .optional(),
  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
  category: Yup.string().optional(),
});

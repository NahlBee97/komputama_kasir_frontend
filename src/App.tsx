import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Added Navigate
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CashierLayout from "./layouts/CashierLayout";
import Pos from "./pages/Pos";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddEditProduct from "./pages/admin/AddEditProduct";
import Sales from "./pages/admin/Sales";
import Report from "./pages/admin/Report";
import AdminLogin from "./pages/AdminLogin";
import Users from "./pages/admin/Users";
import AddEditUser from "./pages/admin/AddEditUser";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={<CashierLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/pos" element={<Pos />} />
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<Products />} />
                <Route
                  path="/admin/products/add"
                  element={<AddEditProduct />}
                />
                <Route
                  path="/admin/products/edit/:id"
                  element={<AddEditProduct />}
                />
                <Route path="/admin/sales" element={<Sales />} />
                <Route path="/admin/report" element={<Report />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/add" element={<AddEditUser />} />
                <Route path="/admin/users/edit/:id" element={<AddEditUser />} />
              </Route>
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;

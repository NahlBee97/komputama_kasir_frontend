import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Added Navigate
import { AuthProvider } from "./components/AuthProvider";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CashierLayout from "./layouts/CashierLayout";
import Pos from "./pages/Pos";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={<CashierLayout />}>
              <Route path="/" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/pos" element={<Pos />} />
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Dashboard />} />
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

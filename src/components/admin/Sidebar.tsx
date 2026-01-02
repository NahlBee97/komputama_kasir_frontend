import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  AssessmentIcon,
  DashboardIcon,
  InventoryIcon,
  LogoutIcon,
  ReceiptIcon,
  UserIcon,
} from "../Icons";
import { useMutation } from "@tanstack/react-query";
import LoadingModal from "../LoadingModal";

const navLinks = [
  { label: "Penjualan Hari Ini", link: "/admin", icon: <DashboardIcon /> },
  {
    label: "Pengaturan Produk",
    link: "/admin/products",
    icon: <InventoryIcon />,
  },
  { label: "Riwayat Penjualan", link: "/admin/sales", icon: <ReceiptIcon /> },
  {
    label: "Laporan Penjualan",
    link: "/admin/report",
    icon: <AssessmentIcon />,
  },
  { label: "List Petugas Kasir", link: "/admin/users", icon: <UserIcon /> },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      return await logout();
    },
  });

  // Helper to determine active state (handles sub-routes like /admin/products/add)
  const isActiveLink = (link: string) => {
    if (link === "/admin") return pathname === "/admin";
    return pathname.startsWith(link);
  };

  return (
    <aside className="hidden md:flex flex-col w-72 h-full bg-white p-5">
      {/* Brand / Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
          <img src="/diarylogo.jpeg" alt="logo" className="rounded-lg" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
          Komputama Kasir
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          {navLinks.map((navLink) => {
            const active = isActiveLink(navLink.link);

            return (
              <Link
                key={navLink.label}
                to={navLink.link}
                className={`
                  group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                  ${
                    active
                      ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-x-0.5 translate-y-0.5"
                      : "text-black/70 hover:bg-gray-100 hover:text-black hover:translate-x-0.5"
                  }
                `}
              >
                {/* Icon wrapper to ensure consistent sizing */}
                <span
                  className={
                    active ? "text-white" : "text-black group-hover:text-black"
                  }
                >
                  {navLink.icon}
                </span>

                <p className="text-sm font-bold uppercase tracking-wide leading-none">
                  {navLink.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="border-t-2 border-black/10 pt-4">
          <button
            onClick={() => handleLogout()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-black/70 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
          >
            <span className="group-hover:text-red-600 transition-colors">
              <LogoutIcon />
            </span>
            <p className="text-sm font-bold uppercase tracking-wide leading-none">
              Keluar
            </p>
          </button>
        </div>
      </nav>
      <LoadingModal isOpen={isPending} message="Keluar..." />
    </aside>
  );
};

export default Sidebar;

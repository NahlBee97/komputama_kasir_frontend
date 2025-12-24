import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  AssessmentIcon,
  DashboardIcon,
  InventoryIcon,
  LogoutIcon,
  ReceiptIcon,
  StorefrontIcon,
  UserIcon,
} from "../Icons";

const GLOW_BORDER = "0 0 1px #f9f906, 0 0 4px #f9f906, 0 0 8px #f9f906";
const GLOW_TEXT = "0 0 2px #f9f906, 0 0 5px #f9f906";

const navLinks = [
  { label: "Penjualan Hari Ini", link: "/admin", icon: <DashboardIcon/> },
  { label: "Pengaturan Produk", link: "/admin/products", icon: <InventoryIcon/> },
  { label: "Riwayat Penjualan", link: "/admin/sales", icon: <ReceiptIcon/> },
  { label: "Laporan Penjualan", link: "/admin/report", icon: <AssessmentIcon/> },
  { label: "List Petugas Kasir", link: "/admin/users", icon: <UserIcon/> },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 min-h-screen md:flex-col gap-8 border-r border-[#f9f906]/20 bg-black p-4 shrink-0 hidden md:flex">
      <div className="flex items-center gap-3 px-3 pt-2">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-[#f9f906]/20 flex items-center justify-center"
          style={{ boxShadow: GLOW_BORDER }}
        >
          <span className="text-[#f9f906]" style={{ textShadow: GLOW_TEXT }}>
            <StorefrontIcon />
          </span>
        </div>
        <h1
          className="text-white text-lg font-bold leading-normal"
          style={{ textShadow: GLOW_TEXT }}
        >
          Diary Kasir
        </h1>
      </div>
      <nav className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          {navLinks.map((navLink) => (
            <Link
              key={navLink.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === navLink.link
                  ? "bg-[#f9f906]/20 text-[#f9f906]"
                  : "text-white/70 hover:bg-[#f9f906]/10 hover:text-white transition-colors"
              }`}
              to={navLink.link}
            >
              {navLink.icon}
              <p className="text-sm font-medium leading-normal">
                {navLink.label}
              </p>
            </Link>
          ))}
        </div>
        <div>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/70 hover:bg-[#f9f906]/10 hover:text-white transition-colors"
            onClick={() => logout()}
          >
            <LogoutIcon />
            <p className="text-sm font-medium leading-normal">Keluar</p>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

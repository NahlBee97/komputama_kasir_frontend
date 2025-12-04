import React from "react";

// --- Icon ---

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// --- Component ---

interface LogoutButtonProps {
  onClick?: () => void;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-3 px-6 py-3 rounded-lg 
        bg-[#11110A] border border-[#f9f906]/30 text-[#f9f906] 
        hover:bg-[#f9f906] hover:text-[#11110A] hover:border-[#f9f906] 
        hover:shadow-[0_0_15px_rgba(249,249,6,0.4)] 
        transition-all duration-300 ${className}`}
    >
      <LogoutIcon />
      <span className="text-sm font-bold tracking-wider">
        Keluar
      </span>
    </button>
  );
};

export default LogoutButton;
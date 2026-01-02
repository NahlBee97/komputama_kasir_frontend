import { LogoutIcon } from "./Icons";

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
      className={`group flex items-center justify-center gap-2 px-5 py-2.5 rounded-full
        bg-white border border-[#007ACC] text-[#007ACC]
        hover:bg-[#007ACC] hover:text-white 
        transition-all duration-200 ease-out
        active:scale-95
        ${className}`}
    >
      <LogoutIcon />
      <span className="text-xs font-black uppercase tracking-widest">
        Keluar
      </span>
    </button>
  );
};

export default LogoutButton;

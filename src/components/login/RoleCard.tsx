interface RoleCardProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const RoleCard = ({ label, icon, isActive, onClick }: RoleCardProps) => (
  <div
    onClick={onClick}
    className={`flex flex-col gap-4 rounded-lg justify-center items-center p-4 aspect-square cursor-pointer transition-all duration-300 border ${
      isActive
        ? "bg-black border-[#f9f906] shadow-[0_0_15px_rgba(249,249,6,0.4)]"
        : "bg-black/50 border-[#f9f906]/20 hover:border-[#f9f906]/60"
    }`}
  >
    <div
      className={`text-5xl transition-all duration-300 ${
        isActive
          ? "text-[#f9f906] drop-shadow-[0_0_8px_rgba(249,249,6,0.6)]"
          : "text-[#f9f906]/70"
      }`}
    >
      {icon}
    </div>
    <p
      className={`text-base font-bold leading-tight tracking-wider transition-colors ${
        isActive ? "text-[#f9f906]" : "text-[#f9f906]/70"
      }`}
    >
      {label}
    </p>
  </div>
);

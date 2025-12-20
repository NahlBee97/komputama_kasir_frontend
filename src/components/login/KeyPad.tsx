export const KeypadButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-4 h-16 rounded-lg text-[#f9f906] text-2xl font-bold bg-black/50 border border-[#f9f906]/20 hover:border-[#f9f906] hover:shadow-[0_0_10px_rgba(249,249,6,0.2)] active:scale-95 transition-all duration-150"
  >
    {children}
  </button>
);
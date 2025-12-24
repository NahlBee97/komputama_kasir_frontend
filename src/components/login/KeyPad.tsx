export const KeypadButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-4 h-16 rounded-lg text-white text-2xl font-bold bg-black/50 border border-[#f9f906]/20 hover:border-black"
  >
    {children}
  </button>
);
import React from "react";

export const KeypadButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="
      flex items-center justify-center h-16 w-full rounded-xl 
      text-2xl font-black
      border-2 border-[#007ACC] bg-white text-[#007ACC] 
      transition-all duration-200 
      hover:bg-[#007ACC] hover:text-white 
      active:scale-95
    "
  >
    {children}
  </button>
);

export const PinDot = ({ filled }: { filled: boolean }) => (
  <div
    className={`h-4 w-4 rounded-full border-2 border-[#007ACC] transition-all duration-200 ${
      filled
        ? "bg-[#007ACC] scale-110" // Solid [#007ACC], slightly larger when filled
        : "bg-transparent scale-100" // Hollow ring when empty
    }`}
  ></div>
);

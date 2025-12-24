export const PinDot = ({ filled }: { filled: boolean }) => (
  <div
    className={`h-3.5 w-3.5 rounded-full border-2 border-black transition-all duration-200 ${
      filled
        ? "bg-black shadow-[0_0_10px_rgba(249,249,6,0.5)] scale-110"
        : "bg-transparent scale-100"
    }`}
  ></div>
);

import { useState, useEffect } from "react";

// --- Icons ---

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Props Interface ---

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (cashReceived: number, change: number) => void;
}

// --- Main Component ---

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onConfirm,
}) => {
  const [cashReceivedStr, setCashReceivedStr] = useState<string>(
    total.toString()
  );
  const [change, setChange] = useState<number>(0);

  // Constants for styling
  const PRIMARY_COLOR = "#f9f906";

  // Calculate change whenever input changes
  useEffect(() => {
    const cash = parseFloat(cashReceivedStr.replace(/[^0-9.]/g, "")) || 0;
    // eslint-disable-next-line
    setChange(Math.max(0, cash - total));
  }, [cashReceivedStr, total]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashReceivedStr(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-sans backdrop-blur-sm">
      {/* Modal Container */}
      <div
        className="relative flex w-full max-w-lg flex-col gap-6 rounded-xl border bg-black p-8 transition-all duration-300 transform scale-100"
        style={{
          borderColor: "rgba(249, 249, 6, 0.5)",
          boxShadow: `0 0 5px ${PRIMARY_COLOR}, 0 0 10px ${PRIMARY_COLOR}, 0 0 15px ${PRIMARY_COLOR}, 0 0 20px ${PRIMARY_COLOR}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#f9f906]/70 hover:text-[#f9f906] transition-colors"
        >
          <CloseIcon />
        </button>

        {/* Headline: FINALIZE PAYMENT */}
        <div className="flex flex-col items-center">
          <h1
            className="text-[#f9f906] tracking-tight text-[32px] font-bold leading-tight text-center pb-3 pt-6"
            style={{ textShadow: "0 0 8px rgba(249, 249, 6, 0.5)" }}
          >
            FINALIZE PAYMENT
          </h1>
        </div>

        {/* Total Amount Display */}
        <div className="flex flex-col items-center">
          <h1
            className="text-[#f9f906] tracking-tight text-[40px] font-bold leading-tight text-center pb-3 pt-2"
            style={{ textShadow: "0 0 8px rgba(249, 249, 6, 0.5)" }}
          >
            TOTAL: Rp {total.toLocaleString("id-ID")}
          </h1>
        </div>

        {/* Cash Received Input */}
        <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col w-full flex-1">
            <p className="text-[#f9f906] text-base font-medium leading-normal pb-2">
              Cash Received
            </p>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f9f906] focus:outline-0 focus:ring-2 focus:ring-[#f9f906] border border-[#f9f906]/50 bg-[#23230f] h-14 placeholder:text-[#f9f906]/50 p-[15px] text-base font-normal leading-normal transition-shadow"
              style={{
                boxShadow: `0 0 5px ${PRIMARY_COLOR}, 0 0 10px ${PRIMARY_COLOR}`,
              }}
              placeholder="Enter amount"
              value={cashReceivedStr}
              onChange={handleInputChange}
              type="number"
            />
          </label>
        </div>

        {/* Change Due Display */}
        <div className="flex flex-col items-center">
          <h1 className="text-[#f9f906] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-center pb-3 pt-2">
            Change Due: Rp {change.toLocaleString("id-ID")}
          </h1>
        </div>

        {/* Pay Button */}
        <div className="flex px-4 py-3 justify-center w-full mt-4">
          <button
            onClick={() =>
              onConfirm(
                parseFloat(cashReceivedStr.replace(/[^0-9.]/g, "")) || 0,
                change
              )
            }
            className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 flex-1 bg-[#f9f906] text-[#23230f] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-yellow-300 transition-colors hover:shadow-[0_0_15px_rgba(249,249,6,0.5)]"
          >
            <span className="truncate">PAY & PRINT RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
import { useState, useEffect } from "react";
import { CloseIcon } from "../Icons";
import { formatCurrency } from "../../helper/formatCurrentcy";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (cashReceived: number, change: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onConfirm,
}) => {
  const [cashReceived, setCashReceived] = useState<string>("");
  const [change, setChange] = useState<number>(0);

  // Calculate change whenever input changes
  useEffect(() => {
    setChange(Math.max(0, Number(cashReceived) - total));
  }, [cashReceived, total]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashReceived(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm">
      {/* Modal Container */}
      <div
        className="relative flex w-full max-w-lg flex-col gap-6 bg-white p-8 transition-all duration-300 transform scale-100 border-2 border-[#007ACC]"
        // Solid [#007ACC] shadow for the "Pop" B&W aesthetic
        style={{
          boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#007ACC] hover:bg-[#007ACC] hover:text-white rounded-full p-1 transition-all duration-200"
        >
          <CloseIcon />
        </button>

        {/* Headline */}
        <div className="flex flex-col items-center border-b-2 border-[#007ACC] pb-4">
          <h1 className="text-[#007ACC] tracking-tight text-3xl font-black leading-tight text-center uppercase">
            Pembayaran
          </h1>
        </div>

        {/* Total Amount Display */}
        <div className="flex flex-col items-center bg-[#007ACC] py-4">
          <h1 className="text-white tracking-tight text-3xl font-black leading-tight text-center uppercase">
            Total : {formatCurrency(total)}
          </h1>
        </div>

        {/* Cash Received Input */}
        <div className="flex w-full flex-col gap-2">
          <label className="text-[#007ACC] text-sm font-bold uppercase tracking-wider">
            Uang Diterima
          </label>
          <input
            autoFocus
            className="w-full border-2 border-[#007ACC] bg-white h-14 px-4 text-xl font-bold text-[#007ACC] placeholder:text-[#007ACC]/30 focus:outline-none focus:bg-gray-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-200"
            placeholder="Masukkan jumlah uang..."
            value={cashReceived}
            onChange={handleInputChange}
            type="number"
          />
        </div>

        {/* Change Due Display */}
        <div className="flex flex-col items-center py-2">
          <p className="text-[#007ACC]/60 text-sm font-bold uppercase tracking-wider">
            Kembalian
          </p>
          <h1 className="text-[#007ACC] text-3xl font-black leading-tight mt-1">
            {formatCurrency(change)}
          </h1>
        </div>

        {/* Pay Button */}
        <div className="flex justify-center w-full mt-2">
          <button
            onClick={() => onConfirm(Number(cashReceived), change)}
            disabled={Number(cashReceived) < total}
            className="
              w-full h-14
              bg-[#007ACC] text-white 
              text-lg font-black uppercase tracking-widest
              border-2 border-[#007ACC]
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
              hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5
              active:scale-[0.99]
              disabled:bg-gray-300 disabled:border-gray-300 disabled:shadow-none disabled:cursor-not-allowed
              transition-all duration-200 ease-out
            "
          >
            Bayar & Print Struk
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

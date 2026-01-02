import Loader from "./Loader";
import { WarningIcon } from "./Icons"; // Ensure you have this or similar icon

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "danger" | "neutral";
}

const ConfirmModal = ({
  isOpen,
  title = "Konfirmasi",
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "neutral",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      {/* Modal Card */}
      <div
        className="
            flex flex-col p-2 w-full max-w-sm 
            bg-white rounded-xl border-2 border-[#007ACC] 
            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            overflow-hidden animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* Content Section */}
        <div className="p-8 flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full border-2 border-[#007ACC] text-[#007ACC]">
            <WarningIcon />
          </div>

          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#007ACC]">
              {title}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#007ACC]/60 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 border-t-2 border-[#007ACC] divide-x-2 divide-[#007ACC]">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
                p-4 text-sm font-black uppercase tracking-wider text-[#007ACC]
                hover:bg-gray-100 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
                flex items-center justify-center
                p-4 text-sm font-black uppercase tracking-wider
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  variant === "danger"
                    ? "bg-[#007ACC] text-white hover:bg-gray-800" // Danger = Solid [#007ACC]
                    : "bg-[#007ACC] text-white hover:bg-gray-800" // Neutral = Solid [#007ACC]
                }
            `}
          >
            {isLoading ? <Loader size="sm" variant="white" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

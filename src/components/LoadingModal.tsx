import Loader from "./Loader";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal = ({
  isOpen,
  message = "Loading...",
}: LoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex min-w-60 flex-col items-center gap-4 rounded-xl border border-gray-700 bg-gray-800 p-10 shadow-xl">
        <Loader size="lg" variant="white" />
        <div className="text-lg font-semibold tracking-wide text-gray-100">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;

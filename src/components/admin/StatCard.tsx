import { formatCurrency } from "../../helper/formatCurrentcy";
import { WarningIcon } from "../Icons";
import Loader from "../Loader";

const StatCard = ({
  title,
  value,
  isCurrency = false,
  isLoading,
  isError,
}: {
  title: string;
  value: string | number;
  isCurrency?: boolean;
  isLoading: boolean;
  isError: boolean;
}) => (
  <div
    className="
      flex min-w-[158px] min-h-[140px] flex-1 flex-col justify-center items-center gap-1 
      rounded-xl bg-white p-6 
      border-2 border-[#007ACC] 
      shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
      transition-transform hover:-translate-y-1
    "
  >
    {isError ? (
      <div className="flex flex-col justify-center items-center gap-2 text-[#007ACC]">
        <WarningIcon />
        <p className="text-sm font-bold uppercase tracking-wide">
          Error loading data
        </p>
      </div>
    ) : (
      <>
        {isLoading ? (
          // Updated Loader to 'dark' for white background
          <Loader size="md" variant="dark" />
        ) : (
          <>
            <p className="text-[#007ACC]/60 text-sm font-bold uppercase tracking-widest text-center">
              {title}
            </p>
            <p className="text-[#007ACC] tracking-tighter text-4xl sm:text-5xl font-black leading-tight mt-1">
              {isCurrency ? formatCurrency(value as number) : value}
            </p>
          </>
        )}
      </>
    )}
  </div>
);

export default StatCard;

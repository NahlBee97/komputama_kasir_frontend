import { formatCurrency } from "../../helper/formatCurrentcy";
import { GLOW_BORDER, GLOW_TEXT } from "../../pages/admin/Dashboard";
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
    className="flex min-w-[158px] min-h-[120px] flex-1 flex-col justify-center items-center gap-2 rounded-xl border border-[#f9f906]/50 bg-[#0A0A0A] p-6"
    style={{ boxShadow: GLOW_BORDER }}
  >
    {isError ? (
      <div className="flex flex-col justify-center items-center">
        <WarningIcon />
        <p className="text-sm">Error loading data</p>
      </div>
    ) : (
      <>
        {isLoading ? (
          <Loader size="md" />
        ) : (
          <>
            <p
              className="text-[#f9f906]/80 text-base font-medium uppercase leading-normal"
              style={{ textShadow: GLOW_TEXT }}
            >
              {title}
            </p>
            <p
              className="text-[#f9f906] tracking-light text-4xl font-bold leading-tight"
              style={{ textShadow: GLOW_TEXT }}
            >
              {isCurrency ? formatCurrency(value as number) : value}
            </p>
          </>
        )}
      </>
    )}
  </div>
);

export default StatCard;

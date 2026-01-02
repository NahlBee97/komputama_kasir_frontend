import { ShoppingBasketIcon } from "../Icons";

const EmptyCart = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white p-6">
      {/* Dashed Container: distinct "drop zone" aesthetic */}
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-[#007ACC]/20 py-24 text-center transition-all duration-300 hover:border-[#007ACC]/50 hover:bg-gray-50">
        {/* Icon: Muted gray/[#007ACC] */}
        <div className="flex items-center justify-center text-[#007ACC]/30">
          {/* Sizing wrapper to ensure the icon scales correctly */}
          <div className="h-20 w-20 [&>svg]:h-full [&>svg]:w-full">
            <ShoppingBasketIcon />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-black uppercase tracking-widest text-[#007ACC]/40">
            Keranjang Kosong
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#007ACC]/30">
            Silahkan Pilih Produk
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;

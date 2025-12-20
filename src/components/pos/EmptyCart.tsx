import { ShoppingBasketIcon } from "../Icons";

const EmptyCart = () => {
  return (
    <div className="layout-container flex h-full grow-0 flex-col w-full max-w-[480px]">
      <div className="relative h-full flex flex-1 justify-center py-5 border-l border-[#f9f906]/30 shadow-[0_0_15px_rgba(249,249,6,0.2)] bg-[#23230f]">
        {/* Glowing vertical border */}
        <div
          className="absolute left-0 top-0 h-full w-0.5 bg-[#f9f906]"
          style={{ boxShadow: "0 0 10px #f9f906" }}
        />

        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col items-center justify-center h-full px-4 py-6">
            <div className="flex flex-col items-center gap-6">
              {/* Icon */}
              <div className="w-48 h-48 flex items-center justify-center">
                <ShoppingBasketIcon />
              </div>

              {/* Text */}
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p
                  className="text-[#f9f906] text-xl font-bold leading-tight tracking-wider text-center"
                  style={{ textShadow: "0 0 8px #f9f906" }}
                >
                  KERANJANG KOSONG
                </p>
                <p className="text-[#f9f906]/70 text-sm font-normal leading-normal max-w-[480px] text-center">
                  Silahkan Pilih Produk
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
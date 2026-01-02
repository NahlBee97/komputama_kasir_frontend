import { useState, useEffect } from "react";
import { BackspaceIcon } from "../components/Icons";
import { PinDot } from "../components/login/PinDot";
import { KeypadButton } from "../components/login/KeyPad";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LoadingModal from "../components/LoadingModal";
import { adminId } from "../config";

const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState<string>("");

  useEffect(() => {
    if (user) {
      if (user.role === "CASHIER") {
        navigate("/pos", { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleNumClick = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (pin: string) => {
      return await login(Number(adminId), pin);
    },
  });

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumClick(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        handleLogin(pin);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [pin]);

  return (
    // Updated: White background, Black text
    <div className="layout-container flex h-full grow flex-col bg-white text-black selection:bg-black selection:text-white">
      <div className="flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="layout-content-container flex flex-col max-w-sm w-full mx-auto">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <img
              src="/diarylogo.jpeg" // Update this path to your logo file
              alt="Logo"
              className="h-24 w-auto object-contain rounded-xl"
            />
          </div>
          {/* Headline */}
          <h1 className="tracking-tight text-[32px] font-black leading-tight text-center mb-8 uppercase">
            Komputama Kasir Admin
          </h1>

          {/* Subheader */}
          <h3 className="text-center text-lg font-bold uppercase tracking-wide">
            Silahkan Masukkan PIN
          </h3>

          {/* PIN Input Display */}
          <div className="flex justify-center p-6">
            <div className="relative flex gap-4">
              {[...Array(6)].map((_, i) => (
                <PinDot key={i} filled={i < pin.length} />
              ))}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 px-4 py-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <KeypadButton
                key={num}
                onClick={() => handleNumClick(num.toString())}
              >
                {num}
              </KeypadButton>
            ))}
            {/* Empty placeholder to align 0 and backspace */}
            <div className="flex items-center justify-center p-4 h-16 rounded-lg"></div>
            <KeypadButton onClick={() => handleNumClick("0")}>0</KeypadButton>
            <KeypadButton onClick={handleBackspace}>
              <BackspaceIcon className="w-8 h-8 text-black" />
            </KeypadButton>
          </div>

          {/* Login Button */}
          <div className="flex p-4 justify-center">
            <button
              onClick={() => handleLogin(pin)}
              disabled={isPending}
              className="
                flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center 
                overflow-hidden rounded-xl h-14 px-5 
                bg-black text-white 
                text-lg font-black leading-normal tracking-widest uppercase
                border-2 border-black
                hover:bg-zinc-800 transition-all duration-200
                active:scale-95
              "
            >
              <span className="truncate">
                {isPending ? "MEMPROSES..." : "LOGIN"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <LoadingModal isOpen={isPending} message="Masuk..." />
    </div>
  );
};

export default AdminLogin;

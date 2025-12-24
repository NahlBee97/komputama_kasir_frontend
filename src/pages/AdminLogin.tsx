import { useState, useEffect } from "react";
import { BackspaceIcon } from "../components/Icons";
import { PinDot } from "../components/login/PinDot";
import { KeypadButton } from "../components/login/KeyPad";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LoadingModal from "../components/LoadingModal";
import toast from "react-hot-toast";

const Login = () => {
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (pin: string) => {
      if (pin.length !== 6) {
        throw new Error("PIN harus terdiri dari 6 digit.");
      }

      const isSuccess = await login(26, "ADMIN", pin);

      if (!isSuccess) {
        throw new Error("PIN Salah! Silakan coba lagi.");
      }

      return isSuccess;
    },

    onSuccess: () => {
      toast.success("Login berhasil!");
      navigate("/admin");
    },

    onError: (error: Error) => {
      toast.error(error.message);
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
        mutate(pin);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [pin]);

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="layout-content-container flex flex-col max-w-sm w-full mx-auto">
          {/* Headline */}
          <h1 className="tracking-light text-[32px] font-bold leading-tight text-center mb-8">
            DIARY KASIR ADMIN
          </h1>

          {/* Role Selection Grid */}
          <h3 className="text-center text-lg font-medium">
            Silahkan Masukkan PIN
          </h3>

          {/* PIN Input Display */}
          <div className="flex justify-center p-4">
            <div className="relative flex gap-4">
              {[...Array(6)].map((_, i) => (
                <PinDot key={i} filled={i < pin.length} />
              ))}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3">
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
              <BackspaceIcon className="w-8 h-8" />
            </KeypadButton>
          </div>

          {/* Login Button */}
          <div className="flex p-4 justify-center">
            <button
              onClick={() => mutate(pin)}
              className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black text-white text-lg font-bold leading-normal tracking-wider hover:brightness-110 hover:shadow-[0_0_15px_rgba(249,249,6,0.5)] transition-all duration-300"
            >
              <span className="truncate">LOGIN</span>
            </button>
          </div>
        </div>
      </div>
      <LoadingModal isOpen={isPending} message="Memproses..." />
    </div>
  );
};

export default Login;

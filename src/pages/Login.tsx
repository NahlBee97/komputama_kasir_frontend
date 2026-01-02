import { useState, useEffect } from "react";
import { BackspaceIcon } from "../components/Icons";
import { PinDot } from "../components/login/PinDot";
import { KeypadButton } from "../components/login/KeyPad";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingModal from "../components/LoadingModal";
import { getAllUsers } from "../services/userServices";
import type { User } from "../interfaces/authInterfaces";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [pin, setPin] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users = [], isLoading: isLoadingUsers, error: isError } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

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
      return await login(selectedUserId!, pin);
    },
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = Number(e.target.value);
    setSelectedUserId(selectedUserId);
  };

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
    //eslint-disable-next-line
  }, [pin]);

  return (
    <div className="layout-container flex h-full grow flex-col bg-white text-black">
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
            KOMPUTAMA KASIR
          </h1>

          {/* Cashier Selection */}
          <div className="flex flex-col justify-center items-center gap-2 mb-2">
            <select
              id="cashier-select"
              className="mb-4 p-3 border-2 border-black rounded-lg w-full bg-white text-black font-medium focus:outline-none"
              onChange={handleUserChange}
            >
              <option value="" className="text-black">
                {isLoadingUsers
                  ? "Memuat data kasir..."
                  : isError ? "Tidak dapat memuat data kasir" : "Pilih Petugas Kasir"}
              </option>
              {users.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt */}
          <h3 className="text-center text-lg font-bold uppercase tracking-wide">
            Masukkan PIN
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
              className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-black text-white text-lg font-black leading-normal tracking-widest hover:bg-gray-800 transition-all duration-200 border-2 border-black"
            >
              <span className="truncate">LOGIN</span>
            </button>
          </div>
        </div>
      </div>
      <LoadingModal isOpen={isPending} message="Masuk..." />
    </div>
  );
};

export default Login;

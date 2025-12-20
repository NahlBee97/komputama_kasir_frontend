import { useNavigate } from "react-router-dom";

const EmptyBucketIllustration = () => (
  <svg
    className="w-full h-auto text-[#f9f906] filter drop-shadow-[0_0_8px_rgba(249,249,6,0.6)]"
    fill="none"
    viewBox="0 0 120 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bucket Outline */}
    <path
      d="M10 20 L20 100 H100 L110 20 M10 20 C30 0, 90 0, 110 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    />
    {/* Sad Face / Empty details */}
    <path
      d="M45 40 L40 70"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <path
      d="M75 40 L80 70"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
  </svg>
);

// --- Main Page Component ---

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0A0A0A] dark group/design-root overflow-hidden font-sans">
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(249,249,6,0.1), rgba(10,10,10,0))",
        }}
      ></div>

      <div className="layout-container relative z-10 flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="layout-content-container flex max-w-lg flex-1 flex-col items-center gap-4 text-center">
            {/* 404 Glitch Text */}
            <h1
              className="text-[#f9f906] tracking-tighter text-[15vw] sm:text-[144px] md:text-[160px] lg:text-[200px] font-bold leading-none"
              style={{
                textShadow: "0 0 20px rgba(249,249,6,0.5)",
              }}
            >
              404
            </h1>

            {/* Illustration */}
            <div
              className="flex w-full max-w-[120px] justify-center text-[#f9f906]"
              aria-label="Stylized minimalist illustration of an empty fried chicken bucket in glowing neon lines"
            >
              <EmptyBucketIllustration />
            </div>

            {/* Page Not Found Text */}
            <h2
              className="text-[#f9f906] text-[22px] sm:text-[28px] font-bold leading-tight tracking-wider mt-4"
              style={{
                textShadow: "0 0 10px rgba(249,249,6,0.5)",
              }}
            >
              Halaman Tidak Ditemukan
            </h2>

            {/* Action Button */}
            <div className="flex w-full justify-center pt-8"
            onClick={() => navigate("/")}>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#f9f906] text-[#0A0A0A] text-base font-bold uppercase tracking-[0.05em] transition-all hover:shadow-[0_0_15px_rgba(249,249,6,0.8)] focus:outline-none focus:ring-2 focus:ring-[#f9f906] focus:ring-offset-2 focus:ring-offset-black">
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

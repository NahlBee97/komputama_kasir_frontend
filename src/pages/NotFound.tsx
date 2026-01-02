import { useNavigate } from "react-router-dom";

// Updated Illustration: Clean [#007ACC] Lines, no glow
const EmptyBucketIllustration = () => (
  <svg
    className="w-full h-auto text-[#007ACC]"
    fill="none"
    viewBox="0 0 120 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bucket Outline - Thicker stroke for B&W bold look */}
    <path
      d="M10 20 L20 100 H100 L110 20 M10 20 C30 0, 90 0, 110 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6"
    />
    {/* Sad Face / Empty details */}
    <path
      d="M45 40 L40 70"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    />
    <path
      d="M75 40 L80 70"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    />
  </svg>
);

// --- Main Page Component ---

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-white overflow-hidden font-sans text-[#007ACC] selection:bg-[#007ACC] selection:text-white">
      {/* Decorative Background Pattern (Optional - dot grid) */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="layout-container relative z-10 flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="layout-content-container flex max-w-lg flex-1 flex-col items-center gap-2 text-center">
            {/* 404 Text - Huge & Heavy */}
            <h1
              className="text-[#007ACC] tracking-tighter text-[15vw] sm:text-[100px] md:text-[160px] font-[#007ACC] leading-none"
              // Hard gray shadow for depth without color
              style={{
                textShadow: "10px 10px 0px rgba(0,0,0,0.1)",
              }}
            >
              404
            </h1>

            {/* Illustration Container */}
            <div
              className="flex w-full max-w-[120px] justify-center mb-2"
              aria-label="Empty bucket illustration"
            >
              <EmptyBucketIllustration />
            </div>

            {/* Page Not Found Text */}
            <h2 className="text-[#007ACC] text-2xl sm:text-3xl font-[#007ACC] uppercase tracking-widest">
              Halaman Tidak Ditemukan
            </h2>

            <p className="text-[#007ACC]/50 font-medium mt-2 max-w-md">
              Sepertinya halaman yang anda cari sudah tidak ada atau telah
              dipindahkan.
            </p>

            {/* Action Button */}
            <div className="flex w-full justify-center pt-4">
              <button
                onClick={() => navigate("/")}
                className="
                    group flex items-center justify-center 
                    h-14 px-10 rounded-full
                    bg-white text-[#007ACC] border-2 border-[#007ACC]
                    text-lg font-black uppercase tracking-widest
                    shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                    hover:bg-[#007ACC] hover:text-white
                    active:scale-95
                    transition-all duration-200 ease-out
                "
              >
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

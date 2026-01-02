const Footer = () => {
  return (
    // Removed bg-black, border-t, and z-index (handled by parent layout wrappers)
    <footer className="w-full bg-[#007ACC] p-4 text-center sm:p-6 md:p-8">
      <div className="flex items-center justify-center">
        {/* Updated Typography: Black, Uppercase, Heavy Weight */}
        <p className="text-xs font-medium tracking-widest text-white">
          © 2026 Nahalil. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

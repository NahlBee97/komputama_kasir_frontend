// Define the shape of the props
interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "primary",
  className = "",
  ...props
}) => {
  // Map string sizes to Tailwind classes
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-8",
  };

  // Map variants to color classes
  const colorClasses = {
    primary: "border-[#f9f906] border-t-transparent",
    secondary: "border-gray-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        inline-block 
        animate-spin 
        rounded-full 
        ${sizeClasses[size]} 
        ${colorClasses[variant]} 
        ${className}
      `}
      {...props}
    >
      {/* Screen reader only text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;

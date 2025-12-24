interface props {
    categories: string[];
    activeCategory: string;
    onSetCategory: (category: string) => void;
}

const ProductTab = ({ categories, activeCategory, onSetCategory }: props) => {
  return (
    <div className="pb-3">
      <div className="flex border-b border-[#f9f906]/20 gap-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSetCategory(category)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-2 transition-colors duration-300 ${
              activeCategory === category
                ? "border-b-[#f9f906] text-[#f9f906]"
                : "border-b-transparent text-[#f9f906]/60 hover:text-[#f9f906]"
            }`}
          >
            <p className="text-base font-bold leading-normal tracking-[0.015em]">
              {category}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductTab
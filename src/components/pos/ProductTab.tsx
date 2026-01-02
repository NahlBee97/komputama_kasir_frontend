interface props {
  categories: string[];
  activeCategory: string;
  onSetCategory: (category: string) => void;
}

const ProductTab = ({ categories, activeCategory, onSetCategory }: props) => {
  return (
    <div className="w-full bg-white pb-2">
      {/* Container: 
        - Removed the bottom border line to make it look like floating chips.
        - Added 'overflow-x-auto' to ensure it scrolls horizontally on smaller screens.
      */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onSetCategory(category)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out
                border border-[#007ACC]
                ${
                  isActive
                    ? "bg-[#007ACC] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] translate-y-0.5"
                    : "bg-white text-[#007ACC] hover:bg-[#007ACC] hover:text-white hover:shadow-lg"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTab;

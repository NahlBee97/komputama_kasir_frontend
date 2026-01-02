const StatusBadge = ({ stock }: { stock: number }) => {
  let styles = "";
  let status = "";

  
  if (stock > 10) {
    styles = "bg-[#007ACC] text-white border-2 border-[#007ACC]";
    status = "Cukup";
  } else if (stock > 0 && stock <= 10) {
    styles = "bg-white text-[#007ACC] border-2 border-[#007ACC]";
    status = "Rendah";
  } else {
    styles ="bg-white text-[#007ACC] border-2 border-dashed border-[#007ACC] opacity-60";
    status = "Habis";
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center 
        px-3 py-1 rounded-full 
        text-xs font-black uppercase tracking-widest
        ${styles}
      `}
    >
      {status}
    </div>
  );
};

export default StatusBadge;

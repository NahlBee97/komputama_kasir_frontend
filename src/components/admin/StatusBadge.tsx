const StatusBadge = ({ stock }: { stock: number }) => {
  let styles = "";
  let status = "";

  
  if (stock > 10) {
    styles = "bg-black text-white border-2 border-black";
    status = "Cukup";
  } else if (stock > 0 && stock <= 10) {
    styles = "bg-white text-black border-2 border-black";
    status = "Rendah";
  } else {
    styles ="bg-white text-black border-2 border-dashed border-black opacity-60";
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

export default function NormalChip({
  children,
}) {
  return (
    <div className="relative 
      rounded-md p-px 
      overflow-hidden
      bg-linear-to-br
      from-[#b7ff64]/30
      via-[#b7ff64]/10
      to-[#b7ff64]/5
    ">
      {/* Card Content */}
      <div
        className="
          rounded-md
          border border-transparent
          bg-[#0d1818]
        "
      >
        {children}
      </div>
    </div>
  );
}
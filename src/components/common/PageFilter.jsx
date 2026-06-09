"use client";

export function PageFilter({ itemsPerPage, onItemsPerPageChange, options = [5, 10, 20, 50] }) {
  return (
    <div className="flex items-center gap-2 text-sm text-(--primary-white)/50 px-6 py-4 border-b border-(--primary-white)/5 bg-(--primary-white)/5">
      <span>Show</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="bg-transparent border border-(--primary-white)/10 rounded px-2 py-1 text-(--primary-white) outline-none focus:border-(--tertiary-green)/50 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-(--secondary-green) text-(--primary-white)">
            {opt}
          </option>
        ))}
      </select>
      <span>entries</span>
    </div>
  );
}

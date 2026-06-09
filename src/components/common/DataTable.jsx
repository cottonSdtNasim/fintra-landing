"use client";

export function DataTable({ columns, data }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="rounded-t-xl overflow-hidden min-w-full inline-block align-middle">
        <table className="min-w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-(--secondary-green) ">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-[14px] font-medium text-(--primary-white) ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {/* divide-y divide-(--primary-white)/5 */}
          <tbody className="">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  // hover:bg-(--primary-white)/5 transition-colors
                  className={`${
                    rowIdx % 2 === 0 ? "bg-[#0d1818]" : "bg-[#192424]"
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-3 text-(--primary-white) font-normal text-[14px] ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left"
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-(--primary-white) font-normal text-[14px]"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import { Typography } from "../../common/Typography";

export default function CompanyStatistic() {
  const dummySections = [
    {
      title: "Profile",
      rows: [
        { label: "Total Trades", value: "12,430" },
        { label: "Total Volume", value: "9,84,321" },
      ],
    },
    {
      title: "Price",
      rows: [
        { label: "Last Traded Price", value: "231.50" },
        { label: "Day Change", value: "+2.30 (1.00%)" },
      ],
    },
    {
      title: "Market",
      rows: [
        { label: "Market Cap", value: "15.2B" },
        { label: "Sector", value: "Pharmaceuticals" },
      ],
    },
  ];

  return (
    <div className="border border-light_border_color bg-cus_white_color rounded-lg p-2 h-full">
      <Typography variant="subheading" className="mb-4">
        Company Statistic
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummySections.map((section) => (
          <div key={section.title}>
            <Typography
              variant="text14"
              className="mb-2 border-b pb-1 border-light_black_color font-[700]"
            >
              {section.title}
            </Typography>

            {section.rows.map((row) => (
              <div key={row.label} className="flex justify-between mb-1">
                <Typography
                  variant="text14"
                  className="text-light_gray_text_color font-[400]"
                >
                  {row.label}
                </Typography>
                <Typography
                  variant="text14"
                  className="text-light_gray_text_color font-[400]"
                >
                  {row.value}
                </Typography>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



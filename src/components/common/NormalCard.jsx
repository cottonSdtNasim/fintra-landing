import Tooltip from "./Tooltip";
import { Typography } from "./Typography";
import { GoQuestion } from "react-icons/go";

export default function NormalCard({
  children,
  height = "h-full",
  title,
  tooltip,
  rounded = "rounded-[12px]",
}) {
  return (
    <div className={`relative ${rounded} p-px ${height}`}>
      {/* Gradient Border */}
      <div
        className={`absolute inset-0
          ${rounded}
          bg-linear-to-br
          from-[#3D4646]/60
          via-[#3D4646]/30
          to-[#3D4646]/5`}
      />

      {/* Card Content */}
      <div
        className={`
          relative
          ${title ? "flex flex-col p-6" : ""}
          ${rounded}
          bg-[#0d1818]
          my-auto
        ${height}`}
      >
        {title && (
          <div className="flex items-center gap-2 shrink-0">
            <Typography
              variant="text16"
              className="text-(--primary-white) font-medium"
            >
              {title}
            </Typography>
            {tooltip && (
              <Tooltip content={tooltip} placement="top">
                <GoQuestion
                  className="cursor-help text-gray-400 hover:text-(--primary-white)"
                  size={16}
                />
              </Tooltip>
            )}
          </div>
        )}

        <div className={title ? "flex-1 min-h-0" : "h-full"}>{children}</div>
      </div>
    </div>
  );
}

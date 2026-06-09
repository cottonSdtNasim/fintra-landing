import { useEffect } from "react";
import { GoX } from "react-icons/go";
import { Typography } from "./Typography";

export default function Modal({ isOpen, onClose, children, title }) {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-(--secondary-black) rounded-xl shadow-2xl flex flex-col z-10">
        {/* Header with Close Icon */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-800">
          <Typography variant="text12" className="font-regular">
            {title || "Modal"}
          </Typography>
          <button
            onClick={onClose}
            className="text-(--primary-white) hover:text-(--primary-white)/60 transition-colors p-1 duration-300 cursor-pointer "
          >
            <GoX size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto  px-6 py-3 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

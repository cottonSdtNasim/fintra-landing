import { IoMdClose } from "react-icons/io";
import EmptyModal from "./EmptyModal";
import { Typography } from "./Typography";

export default function SimpleModal({
  title = "Modal",
  // width = "calc(70vw - 200px)",
  // height = "calc(100vh - 200px)",
  isOpen,
  onClose,
  children,
  flexible = false,
}) {
  return (
    <EmptyModal isOpen={isOpen} onClose={onClose}>
      <div
        className={`bg-light_white_color w-screen h-screen p-4 ${flexible
            ? "md:w-[calc(50vw-200px)] md:h-auto md:rounded-lg"
            : "2xl:w-[calc(70vw-200px)] 2xl:h-[calc(100vh-200px)] 2xl:rounded-lg"
          }`}
      >
        <div className="grid grid-rows-[auto_1fr] h-full gap-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <Typography variant="title">{title}</Typography>
            <button onClick={onClose}>
              {/* <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <path d="M0.332067 0.332059C-0.110689 0.774816 -0.110689 1.49265 0.332067 1.93541L4.39665 5.99997L0.332067 10.0646C-0.110689 10.5074 -0.110689 11.2252 0.332067 11.668C0.774812 12.1107 1.49266 12.1107 1.9354 11.668L5.99998 7.6033L10.0646 11.668C10.5074 12.1107 11.2252 12.1107 11.668 11.668C12.1107 11.2252 12.1107 10.5074 11.668 10.0646L7.6033 5.99997L11.668 1.93542C12.1107 1.49267 12.1107 0.774827 11.668 0.332082C11.2251 -0.110675 10.5074 -0.110675 10.0646 0.332082L5.99998 4.39665L1.9354 0.332059C1.49266 -0.110686 0.774812 -0.110686 0.332067 0.332059Z" fill="currentColor" />
              </svg> */}
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-auto h-full">{children}</div>
        </div>
      </div>
    </EmptyModal>
  );
}

import SimpleModal from "../../common/SimpleModal";
import { Typography } from "../../common/Typography";

export default function NewsModal({
  title = "View Latest News",
  isOpen,
  onClose,
  news = {
    headline: "Headline",
    content: "Lorem Ipsum...",
    timestamp: "XX/XX/XXXX, XX:XX",
    source: "Some website...",
  },
}) {
  return (
    <SimpleModal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      flexible={true}
    >
      <div className="h-full grid grid-rows-[auto_1fr_auto]">
        <div className="mb-2">
          <Typography variant="h4">{news.headline}</Typography>
        </div>

        <div>
          <Typography>{news.content}</Typography>
        </div>

        <div className="flex justify-between mt-2">
          <Typography>Source: {news.source}</Typography>
          <Typography>{news.timestamp}</Typography>
        </div>
      </div>
    </SimpleModal>
  );
}

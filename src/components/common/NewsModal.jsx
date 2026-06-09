import Modal from "./Modal";
import { Typography } from "./Typography";

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
    <Modal title={title} isOpen={isOpen} onClose={onClose} flexible={true}>
      <div className="h-full grid grid-rows-[auto_1fr_auto]">
        <div className="mb-2">
          <Typography variant="Span1620">{news.headline}</Typography>
        </div>

        <div>
          <Typography variant="p">{news.content}</Typography>
        </div>

        <div className="flex justify-between mt-2">
          <Typography variant="p">Source: {news.source}</Typography>
          <Typography variant="p">{news.timestamp}</Typography>
        </div>
      </div>
    </Modal>
  );
}

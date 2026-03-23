import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatTime(createdAt) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Message({ message }) {
  const isUser = message.role === "user";
  const rowClassName = isUser ? "chat-row chat-row-user" : "chat-row chat-row-ai";

  return (
    <div className={rowClassName}>
      <div className="chat-avatar">{isUser ? "U" : "A"}</div>
      <div className="chat-bubble-wrap">
        <div className="chat-bubble chat-markdown">
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          )}
        </div>
        <span className="chat-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}

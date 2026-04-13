import type { ChatMessage } from "@/types/chat";

interface MessageProps {
  message: ChatMessage;
}

function formatTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const rowClassName = isUser
    ? "chat-row chat-row-user"
    : "chat-row chat-row-ai";

  return (
    <div className={rowClassName}>
      <div className="chat-avatar">{isUser ? "U" : "A"}</div>
      <div className="chat-bubble-wrap">
        <p className="chat-bubble chat-text">{message.text}</p>
        <span className="chat-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}

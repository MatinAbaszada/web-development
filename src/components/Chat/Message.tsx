import type { ChatUIMessage } from "@/types/chat";

interface MessageProps {
  message: ChatUIMessage;
}

function formatTime(createdAt?: string) {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMessageText(message: ChatUIMessage) {
  return message.parts
    .filter((part) => {
      return part.type === "text";
    })
    .map((part) => {
      return part.text;
    })
    .join("");
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const rowClassName = isUser
    ? "chat-row chat-row-user"
    : "chat-row chat-row-ai";
  const createdAt = message.metadata?.createdAt;

  return (
    <div className={rowClassName}>
      <div className="chat-avatar">{isUser ? "U" : "A"}</div>
      <div className="chat-bubble-wrap">
        <p className="chat-bubble chat-text">{getMessageText(message)}</p>
        {createdAt ? (
          <span className="chat-time">{formatTime(createdAt)}</span>
        ) : null}
      </div>
    </div>
  );
}

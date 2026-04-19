export default function LoadingIndicator() {
  return (
    <div className="chat-row chat-row-ai">
      <div className="chat-avatar">A</div>
      <div className="chat-bubble-wrap">
        <div className="chat-bubble inline-flex items-center gap-2">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
        <span className="chat-time">Thinking...</span>
      </div>
    </div>
  );
}

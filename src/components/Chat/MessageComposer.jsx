import { useState } from "react";

export default function MessageComposer({ onSendMessage, isLoading, disabled }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isLoading || disabled) {
      return;
    }

    onSendMessage(trimmedDraft);
    setDraft("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <footer className="chat-input-area border-t border-slate-200 bg-white px-4 py-3 md:px-6 md:py-4">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <textarea
          className="chat-input flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={disabled ? "Create or select a conversation first" : "Type your message"}
          aria-label="Message input"
          rows="1"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
        />
        <button
          type="submit"
          className="send-button min-w-[90px] px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || isLoading || draft.trim().length === 0}
        >
          {isLoading ? "Waiting..." : "Send"}
        </button>
      </form>
    </footer>
  );
}

"use client";

import { useState } from "react";

interface MessageComposerProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

export default function MessageComposer({
  onSendMessage,
  isLoading,
  disabled,
}: MessageComposerProps) {
  const [draft, setDraft] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isLoading || disabled) {
      return;
    }

    setDraft("");
    await onSendMessage(trimmedDraft);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <footer className="chat-input-area border-t border-slate-200 bg-white px-4 py-3 md:px-6 md:py-4">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <textarea
          className="chat-input flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            disabled
              ? "Create or select a conversation first"
              : "Type your message"
          }
          aria-label="Message input"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
        />
        <button
          type="submit"
          className="send-button min-w-[90px] rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || isLoading || draft.trim().length === 0}
        >
          {isLoading ? "Waiting..." : "Send"}
        </button>
      </form>
    </footer>
  );
}

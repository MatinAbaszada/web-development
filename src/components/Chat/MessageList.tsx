"use client";

import { useEffect, useRef } from "react";
import LoadingIndicator from "@/components/Chat/LoadingIndicator";
import Message from "@/components/Chat/Message";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messageListRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!messageListRef.current) {
      return;
    }

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, isLoading]);

  return (
    <main
      ref={messageListRef}
      className="message-list flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Select a conversation or start a new chat to begin.
        </div>
      ) : null}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isLoading ? <LoadingIndicator /> : null}
    </main>
  );
}

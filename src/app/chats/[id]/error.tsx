"use client";

interface ChatErrorProps {
  reset: () => void;
}

export default function ChatError({ reset }: ChatErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">
          Something went wrong loading this conversation.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Please try again. If the issue continues, refresh the page and retry
          the action.
        </p>
        <button
          type="button"
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

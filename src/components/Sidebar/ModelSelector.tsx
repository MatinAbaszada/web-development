"use client";

import type { ModelOption } from "@/types/chat";

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function ModelSelector({
  models,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <div className="border-b border-slate-200 px-4 pb-4">
      <label
        htmlFor="modelSelector"
        className="mb-2 block text-xs font-semibold text-slate-600"
      >
        Model
      </label>
      <select
        id="modelSelector"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedModel}
        onChange={(event) => onModelChange(event.target.value)}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

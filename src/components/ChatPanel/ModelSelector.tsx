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
    <div className="flex items-center gap-3">
      <label
        htmlFor="modelSelector"
        className="text-xs font-semibold uppercase tracking-wide text-slate-300"
      >
        Model
      </label>
      <select
        id="modelSelector"
        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

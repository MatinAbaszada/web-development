export default function ModelSelector({ models, selectedModel, onModelChange }) {
  return (
    <div className="px-4 pb-4 border-b border-slate-200">
      <label htmlFor="modelSelector" className="block text-xs font-semibold text-slate-600 mb-2">
        Model
      </label>
      <select
        id="modelSelector"
        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

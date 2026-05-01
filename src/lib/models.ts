import type { ModelOption } from "@/types/chat";

export const DEFAULT_MODEL_ID = "openai/gpt-oss-120b:free";

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "openai/gpt-oss-120b:free",
    name: "OpenAI GPT-OSS 120B",
  },
  {
    id: "z-ai/glm-4.5-air:free",
    name: "Z.ai GLM 4.5 Air",
  },
];

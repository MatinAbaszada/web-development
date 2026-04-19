import type { ModelOption } from "@/types/chat";

export const DEFAULT_MODEL_ID = "arcee-ai/trinity-large-preview:free";

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "arcee-ai/trinity-large-preview:free",
    name: "Arcee Trinity Large",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "StepFun 3.5 Flash",
  },
];

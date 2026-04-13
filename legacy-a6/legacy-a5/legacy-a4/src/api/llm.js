export const DEFAULT_MODEL_ID = "arcee-ai/trinity-large-preview:free";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

export async function getAvailableModels() {
  return [
    {
      id: "arcee-ai/trinity-large-preview:free",
      name: "Arcee Trinity Large",
    },
    {
      id: "stepfun/step-3.5-flash:free",
      name: "StepFun 3.5 Flash",
    },
  ];
}

function parseStreamLine(line, onChunk) {
  if (!line || line.indexOf("data: ") !== 0) {
    return "";
  }

  const jsonPart = line.replace("data: ", "").trim();

  if (!jsonPart || jsonPart === "[DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(jsonPart);
    const choice = parsed.choices && parsed.choices[0];
    const delta = choice && choice.delta;
    const text = delta && delta.content;

    if (text && onChunk) {
      onChunk(text);
    }

    return text || "";
  } catch {
    return "";
  }
}

export async function streamCompletion({ messages, model, onChunk }) {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "Add VITE_OPENROUTER_API_KEY to .env.local before running the app."
    );
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: messages.map((message) => {
        return {
          role: message.role,
          content: message.text,
        };
      }),
    }),
  });

  if (!response.ok) {
    let errorMessage = "OpenRouter request failed.";

    try {
      const errorJson = await response.json();

      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch (err) {
      console.error("Error parsing error response:", err);
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("OpenRouter did not return a readable stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let bufferedText = "";
  let keepReading = true;

  try {
    while (keepReading) {
      const chunkData = await reader.read();

      if (chunkData.done) {
        keepReading = false;
        bufferedText += decoder.decode();
      } else {
        bufferedText += decoder.decode(chunkData.value, { stream: true });
      }

      const lines = bufferedText.split("\n");
      bufferedText = lines.pop() || "";

      for (let index = 0; index < lines.length; index += 1) {
        fullText += parseStreamLine(lines[index].trim(), onChunk);
      }
    }

    if (bufferedText.trim()) {
      fullText += parseStreamLine(bufferedText.trim(), onChunk);
    }
  } finally {
    reader.releaseLock();
  }

  if (!fullText.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return fullText;
}


const OPENROUTER_API_KEY =
  "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";

/**
 * Streams a chat completion response from OpenRouter.
 * @param {Array} messages - Conversation history with role and content.
 * @param {string} model - The model to use
 * @param {Function} onChunk - Callback function called with each text chunk.
 * @returns {Promise<string>} The complete assistant response.
 */
export async function streamCompletion(messages, model, onChunk) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenRouter API Error: ${error.error?.message || response.statusText}`
    );
  }

  let fullResponse = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });

      // Split by newlines and process each line
      const lines = chunk.split("\n");

      for (const line of lines) {
        // Skip empty lines and non-data lines
        if (!line.trim() || !line.startsWith("data: ")) {
          continue;
        }

        // Extract JSON from "data: " prefix
        const jsonStr = line.slice(6).trim();

        // Skip [DONE] marker
        if (jsonStr === "[DONE]") {
          continue;
        }

        try {
          const parsed = JSON.parse(jsonStr);

          // Extract content delta from the response
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            // Call the callback with each chunk
            onChunk(content);
          }
        } catch {
          // Silent fail on JSON parse errors (malformed chunks)
          continue;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullResponse;
}


export async function getAvailableModels() {
  return [
    {
      id: "arcee-ai/trinity-large-preview:free",
      name: "Arcee AI: Trinity Large",
    },
    {
      id: "stepfun/step-3.5-flash:free",
      name: "StepFun: Step 3.5 Flash",
    }
  ];
}

const OPENROUTER_API_KEY = "ADD_YOUR_OPENROUTER_KEY_HERE";

export async function streamCompletion(messages, model, onChunk) {
  const requestBody = {
    model: model,
    messages: messages,
    stream: true,
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
    method: "POST",
      headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    let message = response.statusText;

    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.error && errorJson.error.message) {
        message = errorJson.error.message;
      }
    } catch {
      // keep default message if parsing fails
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("No response body from API");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let keepReading = true;

  while (keepReading) {
    const chunkData = await reader.read();

    if (chunkData.done) {
      keepReading = false;
      continue;
    }

    const textPart = decoder.decode(chunkData.value, { stream: true });
    const lines = textPart.split("\n");

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();

      if (!line || line.indexOf("data: ") !== 0) {
        continue;
      }

      const jsonPart = line.replace("data: ", "").trim();

      if (jsonPart === "[DONE]") {
        continue;
      }

      try {
        const parsed = JSON.parse(jsonPart);
        const delta =
          parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
        const text = delta && delta.content;

        if (text) {
          fullText += text;
          onChunk(text);
        }
      } catch {
        // skip malformed line
      }
    }
  }

  reader.releaseLock();
  return fullText;
}

export async function getAvailableModels() {
  const models = [];

  models.push({
    id: "arcee-ai/trinity-large-preview:free",
    name: "Arcee Trinity Large",
  });

  models.push({
    id: "stepfun/step-3.5-flash:free",
    name: "StepFun 3.5 Flash",
  });

  return models;
}

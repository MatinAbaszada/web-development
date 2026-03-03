import {
  appendMessage,
  createAIMessageBubble,
  appendTextToMessage,
  scrollToBottom,
} from "./chat.js";
import { streamCompletion, getAvailableModels } from "./api.js";

// DOM elements
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageList = document.getElementById("messageList");
const modelSelector = document.getElementById("modelSelector");

// Application state
let messages = [];
let currentModel = "arcee-ai/trinity-large-preview:free";
let isStreaming = false;


async function initialize() {
  // Set up event listeners
  sendButton.addEventListener("click", handleSend);
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  });

  // Populate model selector if it exists
  if (modelSelector) {
    const models = await getAvailableModels();
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name;
      modelSelector.appendChild(option);
    });

    modelSelector.addEventListener("change", (e) => {
      currentModel = e.target.value;
    });

    // Set default model
    modelSelector.value = currentModel;
  }

  // Clear any existing messages from the static HTML preview
  messageList.innerHTML = "";
}


async function handleSend() {
  const text = messageInput.value.trim();

  if (!text || isStreaming) {
    return;
  }

  // Append user message to DOM
  appendMessage(text, "user", messageList);
  scrollToBottom(messageList);

  // Add user message to history
  messages.push({
    role: "user",
    content: text,
  });

  // Clear input field
  messageInput.value = "";
  messageInput.focus();

  // Disable send button during streaming
  isStreaming = true;
  sendButton.disabled = true;

  try {
    // Create empty AI message bubble
    const aiMessageEl = createAIMessageBubble(messageList);
    scrollToBottom(messageList);

    let fullResponse = "";

    // Stream completion from OpenRouter
    fullResponse = await streamCompletion(messages, currentModel, (chunk) => {
      // Append each chunk to the message
      appendTextToMessage(aiMessageEl, chunk);
      scrollToBottom(messageList);
    });

    // Add complete response to message history
    messages.push({
      role: "assistant",
      content: fullResponse,
    });
  } catch (error) {
    console.error("Error streaming response:", error);

    // Append error message to UI
    appendMessage(
      `Error: ${error.message}. Make sure you've set a valid OpenRouter API key in js/api.js`,
      "ai",
      messageList
    );
  } finally {
    // Re-enable send button
    isStreaming = false;
    sendButton.disabled = false;
    messageInput.focus();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

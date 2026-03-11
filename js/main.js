import {
  appendMessage,
  createAIMessageBubble,
  appendTextToMessage,
  scrollToBottom,
} from "./chat.js";
import { streamCompletion, getAvailableModels } from "./api.js";

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageList = document.getElementById("messageList");
const modelSelector = document.getElementById("modelSelector");
const newChatButton = document.querySelector(".new-chat-btn");

let chatHistory = [];
let selectedModel = "arcee-ai/trinity-large-preview:free";
let loading = false;

function clearStarterMessages() {
  messageList.innerHTML = "";
}

function addModelsToSelect(models) {
  if (!modelSelector) {
    return;
  }

  modelSelector.innerHTML = "";

  for (let i = 0; i < models.length; i += 1) {
    const model = models[i];
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.name;
    modelSelector.appendChild(option);
  }

  modelSelector.value = selectedModel;
}

function setLoading(value) {
  loading = value;
  sendButton.disabled = value;
}

async function loadModels() {
  const models = await getAvailableModels();
  addModelsToSelect(models);
}

function onModelChange(event) {
  selectedModel = event.target.value;
}

function onInputKeyDown(event) {
  if (event.key === "Enter" && event.shiftKey === false) {
    event.preventDefault();
    sendMessage();
  }
}

function startNewChat() {
  chatHistory = [];
  messageList.innerHTML = "";
  messageInput.value = "";
  setLoading(false);
  messageInput.focus();
}

async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text || loading) {
    return;
  }

  appendMessage(text, "user", messageList);
  scrollToBottom(messageList);

  chatHistory.push({
    role: "user",
    content: text,
  });

  messageInput.value = "";
  messageInput.focus();

  setLoading(true);

  try {
    const aiRow = createAIMessageBubble(messageList);
    let finalText = "";

    await streamCompletion(chatHistory, selectedModel, (chunkText) => {
      finalText += chunkText;
      appendTextToMessage(aiRow, chunkText);
      scrollToBottom(messageList);
    });

    chatHistory.push({
      role: "assistant",
      content: finalText,
    });
  } catch (error) {
    console.error("stream error", error);

    appendMessage(
      "Request failed. Please check the API key in js/api.js and try again.",
      "ai",
      messageList
    );
  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

async function startApp() {
  clearStarterMessages();
  await loadModels();

  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", onInputKeyDown);
  if (newChatButton) {
    newChatButton.addEventListener("click", startNewChat);
  }

  if (modelSelector) {
    modelSelector.addEventListener("change", onModelChange);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

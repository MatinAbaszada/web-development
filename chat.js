/**
 * AI Chat UI — chat.js
 * Handles message rendering, send interactions, and simulated bot responses.
 */

const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const BOT_RESPONSES = [
  "That's an interesting question! Let me think about that for a moment.",
  "Great point! I'd be happy to help you explore that further.",
  "I understand what you're asking. Here's my perspective on that.",
  "Thanks for sharing that with me. Could you tell me more?",
  "Absolutely! That's something I can definitely assist you with.",
  "I see where you're coming from. Let me provide some context.",
  "That's a thoughtful observation. Here's what I think about it.",
];

/**
 * Returns the current time formatted as HH:MM.
 * @returns {string}
 */
function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Creates and appends a message bubble to the message list.
 * @param {string} text - The message text.
 * @param {"user"|"bot"} sender - Who sent the message.
 */
function appendMessage(text, sender) {
  const isUser = sender === "user";

  const messageEl = document.createElement("div");
  messageEl.classList.add("message", isUser ? "message--user" : "message--bot");

  const avatar = document.createElement("div");
  avatar.classList.add("message__avatar");
  avatar.textContent = isUser ? "🧑" : "🤖";

  const bubble = document.createElement("div");
  bubble.classList.add("message__bubble");

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  const time = document.createElement("span");
  time.classList.add("message__time");
  time.textContent = getCurrentTime();

  bubble.appendChild(paragraph);
  bubble.appendChild(time);
  messageEl.appendChild(avatar);
  messageEl.appendChild(bubble);

  messageList.appendChild(messageEl);
  scrollToBottom();
}

/**
 * Shows an animated typing indicator while the bot "thinks".
 * @returns {HTMLElement} The indicator element (so it can be removed later).
 */
function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.classList.add("typing-indicator");
  indicator.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.classList.add("message__avatar");
  avatar.textContent = "🤖";

  const dots = document.createElement("div");
  dots.classList.add("typing-dots");

  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    dots.appendChild(span);
  }

  indicator.appendChild(avatar);
  indicator.appendChild(dots);
  messageList.appendChild(indicator);
  scrollToBottom();

  return indicator;
}

/**
 * Picks a random response from BOT_RESPONSES.
 * @returns {string}
 */
function getRandomBotResponse() {
  const index = Math.floor(Math.random() * BOT_RESPONSES.length);
  return BOT_RESPONSES[index];
}

/**
 * Simulates a bot reply after a short delay.
 */
function simulateBotReply() {
  sendButton.disabled = true;
  const indicator = showTypingIndicator();

  setTimeout(
    () => {
      indicator.remove();
      appendMessage(getRandomBotResponse(), "bot");
      sendButton.disabled = false;
      messageInput.focus();
    },
    1200 + Math.random() * 800
  );
}

/**
 * Scrolls the message list to the latest message.
 */
function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

/**
 * Reads the input, sends the user message, and triggers a bot reply.
 */
function handleSend() {
  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  appendMessage(text, "user");
  messageInput.value = "";
  messageInput.focus();

  simulateBotReply();
}

// ── Event Listeners ──────────────────────────────────────
sendButton.addEventListener("click", handleSend);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
});

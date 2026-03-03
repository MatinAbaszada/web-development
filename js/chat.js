// Define custom element for chat messages
class ChatMessage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const timestamp = this.getAttribute("timestamp") || "";

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    // Move child content into bubble
    Array.from(this.childNodes).forEach((node) => {
      bubble.appendChild(node.cloneNode(true));
    });

    // Add timestamp
    if (timestamp) {
      const time = document.createElement("span");
      time.classList.add("message-time");
      time.textContent = timestamp;
      bubble.appendChild(time);
    }

    // Clear the element and rebuild
    this.innerHTML = "";
    this.appendChild(bubble);
  }
}

customElements.define("chat-message", ChatMessage);

export function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function appendMessage(text, sender, messageList) {
  const role = sender === "user" ? "user" : "ai";
  const timestamp = getCurrentTime();

  const messageEl = document.createElement("chat-message");
  messageEl.setAttribute("role", role);
  messageEl.setAttribute("timestamp", timestamp);

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  messageEl.appendChild(paragraph);

  messageList.appendChild(messageEl);
  return messageEl;
}

/**
 * Creates an empty AI message bubble for streaming.
 * @param {HTMLElement} messageList - The message list container.
 * @returns {HTMLElement} The empty message element.
 */
export function createAIMessageBubble(messageList) {
  const messageEl = document.createElement("chat-message");
  messageEl.setAttribute("role", "ai");
  messageEl.setAttribute("timestamp", getCurrentTime());

  const paragraph = document.createElement("p");
  paragraph.id = "streaming-content";
  messageEl.appendChild(paragraph);

  messageList.appendChild(messageEl);
  return messageEl;
}


export function appendTextToMessage(messageEl, text) {
  const paragraph = messageEl.querySelector("p");
  if (paragraph) {
    paragraph.textContent += text;
  }
}

export function scrollToBottom(messageList) {
  messageList.scrollTop = messageList.scrollHeight;
}

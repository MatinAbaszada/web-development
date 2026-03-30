function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessageBox(text, role) {
  const row = document.createElement("div");
  row.className = "chat-row";

  if (role === "user") {
    row.classList.add("chat-row-user");
  } else {
    row.classList.add("chat-row-ai");
  }

  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.textContent = role === "user" ? "U" : "A";

  const bubbleWrap = document.createElement("div");
  bubbleWrap.className = "chat-bubble-wrap";

  const bubble = document.createElement("p");
  bubble.className = "chat-bubble";
  bubble.textContent = text;

  const time = document.createElement("span");
  time.className = "chat-time";
  time.textContent = formatTime();

  bubbleWrap.appendChild(bubble);
  bubbleWrap.appendChild(time);

  row.appendChild(avatar);
  row.appendChild(bubbleWrap);

  return row;
}

export function appendMessage(text, sender, messageList) {
  const role = sender === "user" ? "user" : "ai";
  const item = createMessageBox(text, role);
  messageList.appendChild(item);
  return item;
}

export function createAIMessageBubble(messageList) {
  const row = createMessageBox("", "ai");
  const bubble = row.querySelector(".chat-bubble");

  if (bubble) {
    bubble.id = "streaming-content";
  }

  messageList.appendChild(row);
  return row;
}

export function appendTextToMessage(messageEl, text) {
  const paragraph = messageEl.querySelector(".chat-bubble");

  if (paragraph) {
    paragraph.textContent = paragraph.textContent + text;
  }
}

export function scrollToBottom(messageList) {
  messageList.scrollTop = messageList.scrollHeight;
}

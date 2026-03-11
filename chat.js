class ChatMessage extends HTMLElement {
  connectedCallback() {
    this.draw();
  }

  draw() {
    const role = this.getAttribute("role") || "ai";
    const text = this.getAttribute("text") || "";
    const time = this.getAttribute("time") || "";

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

    const wrap = document.createElement("div");
    wrap.className = "chat-bubble-wrap";

    const bubble = document.createElement("p");
    bubble.className = "chat-bubble";
    bubble.textContent = text;

    const stamp = document.createElement("span");
    stamp.className = "chat-time";
    stamp.textContent = time;

    wrap.appendChild(bubble);
    wrap.appendChild(stamp);

    row.appendChild(avatar);
    row.appendChild(wrap);

    this.innerHTML = "";
    this.appendChild(row);
  }
}

if (!customElements.get("chat-message")) {
  customElements.define("chat-message", ChatMessage);
}

const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const replies = [
  "I got your message.",
  "Can you explain a little more?",
  "Thanks, I will think about it.",
  "That makes sense from your side.",
  "I can help with that task.",
];

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMessage(text, role) {
  const node = document.createElement("chat-message");
  node.setAttribute("role", role);
  node.setAttribute("text", text);
  node.setAttribute("time", nowTime());

  messageList.appendChild(node);
  messageList.scrollTop = messageList.scrollHeight;
}

function send() {
  const value = messageInput.value.trim();

  if (!value) {
    return;
  }

  addMessage(value, "user");
  messageInput.value = "";

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * replies.length);
    addMessage(replies[randomIndex], "ai");
    messageInput.focus();
  }, 900);
}

if (sendButton && messageInput && messageList) {
  sendButton.addEventListener("click", send);

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  });
}

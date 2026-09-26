const chatForm = document.querySelector("[data-chat-form]");
const chatInput = document.querySelector("[data-chat-input]");
const chatMessages = document.querySelector("[data-chat-messages]");
const chatEmpty = document.querySelector("[data-chat-empty]");
const chatStorageKey = "property-assistant-messages-v2";
localStorage.removeItem("property-assistant-messages");

function appendMessage(text, role) {
  const message = document.createElement("p");
  message.className = `chat-message chat-message--${role}`;
  message.textContent = text;
  chatMessages.append(message);
}

let savedMessages = [];

try {
  savedMessages = JSON.parse(localStorage.getItem(chatStorageKey) || "[]");
} catch {
  savedMessages = [];
}

savedMessages.forEach((message) => appendMessage(message.text, message.role));
chatEmpty.hidden = savedMessages.length > 0;
chatMessages.scrollTop = chatMessages.scrollHeight;

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const message = { text, role: "user" };
  savedMessages.push(message);
  appendMessage(message.text, message.role);
  chatEmpty.hidden = true;
  localStorage.setItem(chatStorageKey, JSON.stringify(savedMessages));
  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // API hook: replace the URL, then uncomment to send the user's message.
  // fetch("/api/chat/", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message: text, history: savedMessages }),
  // });
});
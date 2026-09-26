const chatForm = document.querySelector("[data-chat-form]");
const chatInput = document.querySelector("[data-chat-input]");
const chatMessages = document.querySelector("[data-chat-messages]");
const sendButton = chatForm.querySelector('[type="submit"]');
const endpoint = chatForm.dataset.apiUrl;
const csrfToken = chatForm.querySelector('[name="csrfmiddlewaretoken"]').value;
const chatEmpty = document.querySelector("[data-chat-empty]");
const chatStorageKey = "property-assistant-messages-v2";
localStorage.removeItem("property-assistant-messages");

function appendMessage(text, role, listings = []) {
  const message = document.createElement("div");
  message.className = `chat-message chat-message--${role}`;
  const body = document.createElement("p");
  body.textContent = text;
  message.append(body);
  listings.forEach((listing) => {
    const link = document.createElement("a");
    link.href = listing.detail_url;
    link.className = "chat-listing-link";
    const price = Number(listing.price_rub || 0).toLocaleString("ru-RU");
    link.textContent = `${listing.title} · ${price} ₽`;
    message.append(link);
  });
  chatMessages.append(message);
}

let savedMessages = [];

try {
  savedMessages = JSON.parse(localStorage.getItem(chatStorageKey) || "[]");
} catch {
  savedMessages = [];
}

savedMessages.forEach((message) => appendMessage(message.text, message.role, message.listings || []));
chatEmpty.hidden = savedMessages.length > 0;
chatMessages.scrollTop = chatMessages.scrollHeight;

chatForm.addEventListener("submit", async (event) => {
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
  sendButton.disabled = true;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Не удалось получить ответ ассистента.");
    const answer = { text: data.reply, role: "assistant", listings: data.listings || [] };
    savedMessages.push(answer);
    appendMessage(answer.text, answer.role, answer.listings);
  } catch (error) {
    const answer = { text: error.message, role: "assistant" };
    savedMessages.push(answer);
    appendMessage(answer.text, answer.role);
  } finally {
    localStorage.setItem(chatStorageKey, JSON.stringify(savedMessages));
    sendButton.disabled = false;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
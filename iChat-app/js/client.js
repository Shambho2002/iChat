const socket = io("http://localhost:8000");

// DOM elements
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const audio = new Audio("ting.mp3");

/**
 * Append message to the chat container
 * @param {string} message - The message text
 * @param {"left" | "right"} position - Position of the message
 */
function appendMessage(message, position) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message; // safer than innerHTML
  messageElement.classList.add("message", position);
  messageContainer.appendChild(messageElement);

  if (position === "left") {
    audio.play();
  }
}

// Handle form submission (send message)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  appendMessage(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

// Prompt for username
let userName = prompt("Enter your name to join...!");
if (userName && userName.trim()) {
  userName = userName.trim();
  socket.emit("new-user-joined", userName);
}

// When a new user joins
socket.on("user-joined", (name) => {
  appendMessage(`${name} joined the chat`, "left");
});

// When a message is received
socket.on("receive", (data) => {
  appendMessage(`${data.name}: ${data.message}`, "left");
});

// When a user leaves
socket.on("user-left", (name) => {
  appendMessage(`${name} left the chat`, "left");
});

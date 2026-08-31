// scripts/components/chatWidget.js

export function initPortfolioChat() {
  // 1. Select your chat elements from the DOM
  const chatForm = document.querySelector('#chat-form'); // or your form/input selector
  const chatInput = document.querySelector('#chat-input');
  const chatMessages = document.querySelector('#chat-messages');

  // If your chat elements don't exist on the page, safely return
  if (!chatInput) return;

  // 2. Your message handling logic
  async function handleSendMessage(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Append AI reply to your chat UI
      appendMessageToChat('assistant', data.reply);
    } catch (error) {
      console.error(error);
      appendMessageToChat('assistant', 'Error connecting to AI assistant.');
    }
  }

  // Helper to append messages to your UI (adjust selectors to match your HTML)
  function appendMessageToChat(role, text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
  }

  // Attach event listener if form exists
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessageToChat('user', text);
      chatInput.value = '';
      handleSendMessage(text);
    });
  }
}
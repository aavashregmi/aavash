// scripts/components/chatWidget.js

export function initPortfolioChat() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWindow) return;

  // 1. Toggle open/close on button click
  toggleBtn.addEventListener('click', () => {
    const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
    chatWindow.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && chatInput) chatInput.focus();
  });

  // 2. Close button handler
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

  // 3. Message sending logic
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage('user', text);
    chatInput.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Append AI reply
      appendMessage('assistant', data.reply);
    } catch (error) {
      console.error(error);
      appendMessage('assistant', 'Error connecting to AI assistant.');
    }
  }

  // Helper to add messages to UI
  function appendMessage(role, text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    
    if (role === 'user') {
      msgDiv.style.cssText = 'background: #238636; padding: 8px 12px; border-radius: 8px; align-self: flex-end; max-width: 85%; color: #fff;';
    } else {
      msgDiv.style.cssText = 'background: #21262d; padding: 8px 12px; border-radius: 8px; align-self: flex-start; max-width: 85%; color: #c9d1d9;';
    }
    
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 4. Event listeners for Send button & Enter key
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }
}
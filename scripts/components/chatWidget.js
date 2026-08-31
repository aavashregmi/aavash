// Example snippet for handling message submission in your chat widget
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
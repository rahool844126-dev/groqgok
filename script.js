const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function addMessage(content, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  userInput.value = '';
  addMessage('Groq is typing...', 'bot');

  try {
    const res = await fetch('api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    // Remove "Groq is typing..."
    chatBox.removeChild(chatBox.lastChild);
    if (data.choices && data.choices[0] && data.choices[0].message) {
      addMessage(data.choices[0].message.content, 'bot');
    } else {
      addMessage('Sorry, something went wrong.', 'bot');
    }
  } catch (err) {
    chatBox.removeChild(chatBox.lastChild);
    addMessage('Error connecting to Groq API.', 'bot');
  }
});

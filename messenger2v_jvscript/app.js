document.addEventListener("DOMContentLoaded", function () {
    loadMessages();
    loadChats();
});

function login() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('login').style.display = 'none';
        document.getElementById('messenger').style.display = 'flex';
        loadChats();
    }
}

function sendMessage() {
    const message = document.getElementById('message').value;
    const username = localStorage.getItem('username');
    const currentChat = localStorage.getItem('currentChat') || 'General Chat';
    if (message) {
        const chatMessage = {
            user: username,
            text: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveMessage(currentChat, chatMessage);
        displayMessage(chatMessage);
        document.getElementById('message').value = '';
    }
}

function displayMessage({ user, text, timestamp, imageUrl }) {
    const output = document.getElementById('output');
    const messageElement = document.createElement('p');
    if (imageUrl) {
        messageElement.innerHTML = `<strong>${user}</strong>: <br><img src="${imageUrl}" alt="Image"><span class="timestamp">${timestamp}</span>`;
    } else {
        messageElement.innerHTML = `<strong>${user}</strong>: ${text}<span class="timestamp">${timestamp}</span>`;
    }
    output.appendChild(messageElement);
    output.scrollTop = output.scrollHeight;
}

function saveMessage(chat, message) {
    let messages = JSON.parse(localStorage.getItem(chat)) || [];
    messages.push(message);
    localStorage.setItem(chat, JSON.stringify(messages));
}

function loadMessages() {
    const currentChat = localStorage.getItem('currentChat') || 'General Chat';
    const messages = JSON.parse(localStorage.getItem(currentChat)) || [];
    messages.forEach(displayMessage);
}

function createGroup() {
    document.getElementById('create-group-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('create-group-modal').style.display = 'none';
}

function addGroup() {
    const groupName = document.getElementById('group-name').value;
    if (groupName) {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        chats.push(groupName);
        localStorage.setItem('chats', JSON.stringify(chats));
        closeModal();
        loadChats();
    }
}

function loadChats() {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    let chats = JSON.parse(localStorage.getItem('chats')) || ['General Chat'];
    chats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        chatElement.textContent = chat;
        chatElement.onclick = () => switchChat(chat);
        chatList.appendChild(chatElement);
    });
}

function switchChat(chat) {
    localStorage.setItem('currentChat', chat);
    document.getElementById('current-chat-name').textContent = chat;
    document.getElementById('output').innerHTML = '';
    loadMessages();
}

document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        const username = localStorage.getItem('username');
        const currentChat = localStorage.getItem('currentChat') || 'General Chat';
        const chatMessage = {
            user: username,
            imageUrl: imageUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveMessage(currentChat, chatMessage);
        displayMessage(chatMessage);
    }
    reader.readAsDataURL(file);
});

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

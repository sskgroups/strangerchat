const peer = new Peer(); 
let conn = null;

const msgInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const nextBtn = document.getElementById('next-btn');
const chatBox = document.getElementById('chat-box');
const statusPill = document.getElementById('status-pill');

// When ID is generated
peer.on('open', (id) => {
    console.log("Your ID:", id);
    statusPill.innerText = "Online";
    statusPill.className = "status-online";
    addMessage("System", "Your ID: " + id + " (Copy to other tab)");
});

// Receiving a connection
peer.on('connection', (incoming) => {
    initChat(incoming);
    addMessage("System", "Stranger connected!");
});

function initChat(connection) {
    conn = connection;
    msgInput.disabled = false;
    sendBtn.disabled = false;
    nextBtn.innerText = "Stop";

    conn.on('data', (data) => addMessage("Stranger", data));
    conn.on('close', () => {
        addMessage("System", "Stranger left.");
        stopChat();
    });
}

function addMessage(sender, text) {
    const div = document.createElement('div');
    div.classList.add('message');
    if (sender === "You") div.classList.add('user');
    else if (sender === "Stranger") div.classList.add('stranger');
    else div.classList.add('system-msg');

    div.innerHTML = sender === "System" ? text : `<b>${sender}:</b> ${text}`;
    chatBox.appendChild(div);
    chatBox.parentElement.scrollTop = chatBox.parentElement.scrollHeight;
}

sendBtn.onclick = () => {
    const val = msgInput.value.trim();
    if(val && conn) {
        conn.send(val);
        addMessage("You", val);
        msgInput.value = "";
    }
};

nextBtn.onclick = () => {
    if (conn) {
        conn.close();
        stopChat();
    } else {
        const id = prompt("Enter Stranger ID:");
        if (id) {
            const connection = peer.connect(id);
            initChat(connection);
        }
    }
};

function stopChat() {
    conn = null;
    msgInput.disabled = true;
    sendBtn.disabled = true;
    nextBtn.innerText = "Start";
}
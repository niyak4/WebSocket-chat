const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);

ws.onopen = () => {
    console.log('Welcome!');
    // sending a send event to websocket server
    ws.send(JSON.stringify({
        type: "message",
        data: "User connected."
    }));
}
// event emmited when receiving message 
ws.onmessage = function (event) {
    const messagesBox = document.getElementById('messagesBox');
    const msg = JSON.parse(event.data);

    console.log(event);
            
    messagesBox.innerHTML += `${msg.username}: ${msg.data}<br>`;
}

ws.onerror = function (err) {
    console.error(err);
}

ws.onclose = function () {
    ws.send(JSON.stringify({
        type: "message",
        data: "User disconnected."
    }));
}

function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    const messagesBox = document.getElementById('messagesBox');

    if (username && message) {
        ws.send(JSON.stringify({
            type: "username",
            data: username
        }));

        ws.send(JSON.stringify({
            type: "message",
            data: message
        }));

        messagesBox.innerHTML += `You: ${message}<br>`;
        document.getElementById('message').value = '';
        messagesBox.scrollTop = messagesBox.scrollHeight;
    } else if (message === '') {
        return ;
    } else {
        alert('Input username');
    }
}

document.getElementById('message').onkeydown = (key) => {
    if (key.keyCode === 13 ) sendMessage();
}

document.getElementById('sendBtn').onclick = sendMessage;
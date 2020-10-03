const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();

const server = http.Server(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/', (req, res) => {
  res.end('Welcome page.');
});

app.get('/login', (req, res) => {
  res.end('Login page.');
});
  
app.get('/chat', (req, res) => {
  res.sendFile('./public/client.html', { root: __dirname });
});

const wss = new WebSocketServer({ server: server });

const date = new Date().getHours();

fs.appendFile(__dirname + `/log-${date}.txt`, `Log started in ${date}\n`, function(err) {
  if (err) return console.log(err);

  console.log("Log File created.");
}); 

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(`Received: ${message}`);

    message = JSON.parse(message);

    if (message.type == "username") {
      ws.personName = message.data;
      return ;
    }

    if (message.data == "User connected.") {
      wss.clients.forEach(function each(client) {
        if (client != ws) {
          client.send(JSON.stringify({
            username: 'Server',
            data: message.data
          }));
        }
      });
      return ;
    }

    if (message.data == "User disconnected.") {
      wss.clients.forEach(function each(client) {
        if (client != ws) {
          client.send(JSON.stringify({
            username: 'Server',
            data: message.data
          }));
        }
      });
      return ;
    }

    wss.clients.forEach(function each(client) {
      if (client != ws) {
        client.send(JSON.stringify({
          username: ws.personName,
          data: message.data
        }));

        fs.appendFile(`log-${date}.txt`, `Username: ${ws.personName} - Message: ${message.data}\n`, (error) => {
          if (error) throw error;
        });
      }
    });
  });
  ws.on('close', () => {
    console.log(`${ws.personName} disconnected.`);

    fs.appendFile(`log-${date}.txt`, `User '${ws.personName}' disconnected.\n`, (error) => {
      if (error) throw error;
    });
  });
});
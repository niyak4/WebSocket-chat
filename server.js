const express = require('express');
const WebSocketServer = require('ws').Server;
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = express()
   //.use(express.static('public'));
   .use((req, res) => res.sendFile('./public/client.html', { root: __dirname }))
   .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server: server });

const date = new Date().getHours();

fs.appendFile(__dirname + `/log-${date}.txt`, `Log started in ${date}`, function(err) {
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
      }

      fs.appendFile(`log-${date}.txt`, '\n' + `Username: ${ws.personName} - Message: ${message.data}`, (error) => {
        if (error) throw error;
      });
    });
  });
  ws.on('close', () => {
    console.log(`${ws.personName} disconnected.`);
  });
});
const WebSocketServer = require('ws').Server,

wss = new WebSocketServer({port: 40510})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(`Received: ${message}`);

    message = JSON.parse(message);

    if (message.type == "username") {
      ws.personName = message.data;
      return ;
    }

    wss.clients.forEach(function each(client) {
      if (client != ws) {
        client.send(JSON.stringify({
          username: ws.personName,
          data: message.data
        }));
      }
    });

  });
    
  ws.on('close', () => {
    console.log(`Client disconnected.`);
  });
});

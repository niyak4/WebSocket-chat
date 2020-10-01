const WebSocketServer = require('ws').Server;

const portt = process.env.PORT || 40510;
      
const wss = new WebSocketServer({port: portt});

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

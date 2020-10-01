const express = require('express');
const ws = require('./ws');

const PORT = 3000;

let app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/public/client.html');
});

app.listen(3000, function () {
   console.log(`Server listening on port ${PORT}!`)
});
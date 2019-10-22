const express = require('express')
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const events = require('events');
const eventEmitter = new events.EventEmitter();

const demProcess = require('./node_modules/dem/demProcess.js')

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// Configure socket.io connection
io.on('connection', (socket) => {
  console.log('Server connected!')

  eventEmitter.addListener('dem-success', (pathToRenderedFile) => {
    socket.emit('dem-success', pathToRenderedFile);
  });

  socket.on('getDEM', (demParamsFromClient) => {
    demProcess(demParamsFromClient, eventEmitter, true);
  });
});

// Configure web server and middleware
server.listen(port)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static('public'));

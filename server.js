const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let ball = {
  x: 400,
  y: 300,
  speedX: 2,
  speedY: 2
};
let scores = { 1: 0, 2: 0 };

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  if (players.length < 2) {
    const playerId = players.length + 1;
    players.push({ id: playerId, socket: socket });
    socket.emit('playerId', playerId);
  } else {
    socket.emit('gameFull');
  }

  socket.on('paddleMove', (data) => {
    socket.broadcast.emit('opponentPaddleMove', data);
  });

  socket.on('ballMove', (data) => {
    ball = data;
    socket.broadcast.emit('ballMove', data);
  });

  socket.on('scoreUpdate', () => {
    io.emit('updateScores', scores);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players = players.filter(player => player.socket.id !== socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

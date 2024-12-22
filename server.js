const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Game state
let players = [];
let ball = {
  x: 400,
  y: 300,
  speedX: 2,
  speedY: 2
};
let scores = { 1: 0, 2: 0 };

app.use(express.static('public'));

// Serve index.html at the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  if (players.length < 2) {
    // Assign player ID (1 or 2)
    const playerId = players.length + 1;
    players.push({ id: playerId, socket: socket });
    socket.emit('playerId', playerId);
  } else {
    socket.emit('gameFull');
  }

  // Handle player paddle movement
  socket.on('paddleMove', (data) => {
    // Broadcast player's paddle movement to the other player
    socket.broadcast.emit('opponentPaddleMove', data);
  });

  // Handle the ball movement
  socket.on('ballMove', (data) => {
    // Update the ball's position
    ball = data;
    // Broadcast ball movement to the other player
    socket.broadcast.emit('ballMove', data);
  });

  // Update scores and broadcast them to both players
  socket.on('scoreUpdate', () => {
    io.emit('updateScores', scores);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players = players.filter(player => player.socket.id !== socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

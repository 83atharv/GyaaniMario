const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 100;
let paddle1Y = canvas.height / 2 - paddleHeight / 2, paddle2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 2, ballSpeedY = 2; // Start with lower speed
let playerId = null;

let upArrowPressed = false;
let downArrowPressed = false;
let wKeyPressed = false;
let sKeyPressed = false;

let player1Score = 0;
let player2Score = 0;

let timeElapsed = 0; // Track time to gradually increase ball speed

// Handle keyboard input for player movement
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') upArrowPressed = true;
  if (event.key === 'ArrowDown') downArrowPressed = true;
  if (event.key === 'w') wKeyPressed = true;
  if (event.key === 's') sKeyPressed = true;
});
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') upArrowPressed = false;
  if (event.key === 'ArrowDown') downArrowPressed = false;
  if (event.key === 'w') wKeyPressed = false;
  if (event.key === 's') sKeyPressed = false;
});

// Socket event to receive player ID
socket.on('playerId', (id) => {
  playerId = id;
  console.log(`Player ID: ${playerId}`);
});

// Socket event when the game is full
socket.on('gameFull', () => {
  alert('Game is full! Please try again later.');
});

// Socket event to receive opponent's paddle position
socket.on('opponentPaddleMove', (data) => {
  if (playerId !== data.playerId) {
    // Update opponent's paddle position
    paddle2Y = data.y;
  }
});

// Socket event to receive ball movement
socket.on('ballMove', (data) => {
  ballX = data.x;
  ballY = data.y;
  ballSpeedX = data.speedX;
  ballSpeedY = data.speedY;
});

// Socket event to receive updated scores
socket.on('updateScores', (scores) => {
  player1Score = scores[1];
  player2Score = scores[2];
});

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);  // Player 1
  ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);  // Player 2
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw scores
  drawScores();
}

// Draw scores
function drawScores() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Player 1: ${player1Score}`, 50, 50);
  ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 50);
}

// Check for game over
function checkGameOver() {
  if (player1Score >= 5 || player2Score >= 5) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(`Game Over!`, canvas.width / 2 - 150, canvas.height / 2);
    ctx.fillText(player1Score >= 5 ? "Player 1 Wins!" : "Player 2 Wins!", canvas.width / 2 - 200, canvas.height / 2 + 60);
    return true;
  }
  return false;
}

// Update game objects
function update() {
  if (checkGameOver()) return;

  // Gradually increase ball speed over time
  timeElapsed++;
  if (timeElapsed % 500 === 0) { // Every 500 frames, increase speed
    ballSpeedX *= 1.05;  // Increase ball speed by 5%
    ballSpeedY *= 1.05;
  }

  // Player 1 control
  if (upArrowPressed && paddle1Y > 0) {
    paddle1Y -= 5;
  }
  if (downArrowPressed && paddle1Y < canvas.height - paddleHeight) {
    paddle1Y += 5;
  }

  // Player 2 control
  if (wKeyPressed && paddle2Y > 0) {
    paddle2Y -= 5;
  }
  if (sKeyPressed && paddle2Y < canvas.height - paddleHeight) {
    paddle2Y += 5;
  }

  // Ball collision with walls
  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddles
  if (
    (ballX <= paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
    (ballX >= canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Send paddle and ball data to the server
  socket.emit('paddleMove', { playerId, y: paddle1Y });
  socket.emit('ballMove', { x: ballX, y: ballY, speedX: ballSpeedX, speedY: ballSpeedY });

  // Draw everything
  draw();
}

// Game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game loop once connected
socket.on('connect', () => {
  gameLoop();
});

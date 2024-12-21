
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game_over');
const summaryScreen = document.querySelector('.summary-screen');
const restartBtn = document.querySelector('#restart-btn');

let currentPosition = -80; 
let speed = 5; 
const speedIncrement = 0.5;
const speedIntervalTime = 500; 
let gameRunning = true;

const jump = () => {
  if (gameRunning) {
    mario.classList.add('jump');
    setTimeout(() => {
      mario.classList.remove('jump');
    }, 500);
  }
};

pipe.style.animation = 'none';


setInterval(() => {
  if (gameRunning) {
    speed += speedIncrement;
    console.log('Speed increased to:', speed);
  }
}, speedIntervalTime);

const movePipe = () => {
  if (!gameRunning) return;
  
  currentPosition += speed;
  

  if (currentPosition >= window.innerWidth) {
    currentPosition = -80;
  }
  
  pipe.style.right = `${currentPosition}px`;
  requestAnimationFrame(movePipe);
};

const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
  const cloudsPosition = +window.getComputedStyle(clouds).left.replace('px', '');

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    gameRunning = false;
    
    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    clouds.style.animation = 'none';
    clouds.style.left = `${cloudsPosition}px`;

    mario.src = "images/game-over.png";
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOver.textContent = "Game over";

    clearInterval(loop);


    summaryScreen.style.display = 'block';
  }
}, 10);


restartBtn.addEventListener('click', () => {
  summaryScreen.style.display = 'none';
  location.reload(); 
});


requestAnimationFrame(movePipe);

document.addEventListener('keydown', jump);
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game_over');
const summaryScreen = document.querySelector('.summary-screen');
const restartBtn = document.querySelector('#restart-btn');
const popup = document.querySelector('.popup');
const nextBtn = document.querySelector('#next-btn');

const jumpSound = new Audio('../sounds/Mario-jump-sound.mp3'); 
jumpSound.load();

const gameOverSound = new Audio('../sounds/game-over-sound2.mp3');
gameOverSound.load();

const backgroundMusic = new Audio('../sounds/aboveground_bgm.ogg');
backgroundMusic.loop = true;  
backgroundMusic.volume = 0.8; 



const encouragingMessages = [
    "Computer Science is the study of algorithms, data structures, and computational systems. It involves coding, problem-solving, and analyzing systems to achieve computational goals.",
    "A program is a set of instructions that a computer follows to perform a task or solve a problem over a specified period.",
    "Debugging is the act of identifying and fixing errors in code to ensure a program runs as expected and functions properly.",
    "A data structure allows you to organize and store data in ways that optimize access and manipulation, whereas an algorithm is a step-by-step procedure to solve a problem.",
    "Virtualization allows developers to run multiple operating systems and applications on a single physical machine with isolated environments.",
    "A function is a reusable block of code that takes input, processes it, and returns an output, which is a key element of efficient programming.",
    "Algorithmic complexity refers to the uncertainty of how much time or space a given algorithm will require to execute. The higher the complexity, the more resources it consumes, and vice versa.",
    "Latency is the delay in processing or transmitting data over a network, which can affect the speed and responsiveness of systems.",
    "An algorithm is a step-by-step procedure for solving a problem or performing a task in computing, designed to achieve a specific outcome.",
    "The software development lifecycle involves stages like planning, design, coding, testing, and maintenance, which ensure that applications work effectively and meet user needs.",
    "Modularization is the strategy of breaking down a program into smaller, manageable pieces (modules) to improve maintainability and reduce complexity.",
    "Recursion is a programming technique where a function calls itself in order to solve smaller instances of the same problem, often with an evolving state."
];


let currentPosition = -80;
let speed = 5;
const speedIncrement = 0.5;
const speedIntervalTime = 500;
let gameRunning = true;
let showingPopup = false;
let currentMessageIndex = 0;
let justCrossedPipe = false;

const jump = () => {
    if (gameRunning && !showingPopup) {
      jumpSound.play();
      mario.classList.add('jump');
      setTimeout(() => {
        mario.classList.remove('jump');
      }, 500);
    }
  };
  
  document.addEventListener('keydown', () => {
    if (!backgroundMusic.playing) {
      backgroundMusic.play();
    }
  });
  

pipe.style.animation = 'none';

setInterval(() => {
    if (gameRunning) {
        speed += speedIncrement;
        console.log('Speed increased to:', speed);
    }
}, speedIntervalTime);

const showNextMessage = () => {
    if (currentMessageIndex < encouragingMessages.length) {
        showingPopup = true;
        const popupText = popup.querySelector('p');
        popupText.textContent = encouragingMessages[currentMessageIndex];
        popup.style.display = 'block';
        currentMessageIndex++;
    }
};

const movePipe = () => {
    if (!gameRunning || showingPopup) return;

    currentPosition += speed;
    const pipePosition = window.innerWidth - currentPosition;
    const marioPosition = mario.getBoundingClientRect();

    if (pipePosition < marioPosition.left && !justCrossedPipe) {
        justCrossedPipe = true;
        showNextMessage();
    }

    if (currentPosition >= window.innerWidth) {
        currentPosition = -80;
        justCrossedPipe = false;
    }

    pipe.style.right = `${currentPosition}px`;
    requestAnimationFrame(movePipe);
};

const closePopup = () => {
    showingPopup = false;
    popup.style.display = 'none';
    requestAnimationFrame(movePipe);
};

nextBtn.addEventListener('click', closePopup);

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const cloudsPosition = +window.getComputedStyle(clouds).left.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        gameRunning = false;

        gameOverSound.play();

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        clouds.style.animation = 'none';
        clouds.style.left = `${cloudsPosition}px`;

        mario.src = "images/game-over.png";
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOver.textContent = "Game over";

        clearInterval(loop);

        backgroundMusic.pause();

        summaryScreen.style.display = 'block';
    }
}, 10);

// restartBtn.addEventListener('click', () => {
//     window.location.href = 'questions.html';
// });

requestAnimationFrame(movePipe);

document.addEventListener('keydown', jump);

window.addEventListener('load', function () {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}
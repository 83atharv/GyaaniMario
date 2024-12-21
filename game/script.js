const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game_over');
const summaryScreen = document.querySelector('.summary-screen');
const restartBtn = document.querySelector('#restart-btn');
const popup = document.querySelector('.popup');
const nextBtn = document.querySelector('#next-btn');

const encouragingMessages = [
    "Finance is the study of managing money and investments. It involves budgeting, saving, investing, and analyzing markets to achieve financial goals.",
    "A budget is a financial plan that outlines income and expenditures over a specified period.",
    "Saving is the act of setting aside money for future use. It helps prepare for unexpected expenses and achieve financial goals.",
    "A savings account allows you to deposit money, earn interest, and access funds easily, whereas a checking account is used for daily transactions like paying bills.",
    "Credit allows individuals to borrow money to make purchases with an agreement to pay back over time, often with interest.",
    "A loan is borrowed money that must be repaid with interest, which is the fee for borrowing the money.",
    "Investment risk refers to the uncertainty of earning a return on an investment. The higher the risk, the higher the potential return, and vice versa.",
    "Inflation is the rise in prices over time, decreasing the purchasing power of money.",
    "An investment is the act of allocating money in the hope that it will generate income or appreciate over time.",
    "The stock market allows individuals to buy and sell shares of companies. Stock prices fluctuate based on company performance and market conditions.",
    "Diversification is the strategy of spreading investments across different assets to reduce risk.",
    "Compound interest is the interest on both the initial principal and the accumulated interest from previous periods."
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

    // Check if Mario has just crossed the pipe
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
    window.location.href = 'questions.html';
});

requestAnimationFrame(movePipe);

document.addEventListener('keydown', jump);
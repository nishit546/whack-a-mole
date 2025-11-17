// DOM Elements
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const message = document.querySelector('.message');
const hitCounter = document.querySelector('.hit-counter');
const lastGame = document.querySelector('#lastScoreBox');
const fastDisplay = document.querySelector('#fastTime');
let moleStartTime = 0;

// Game State
let score = 0;
let maxScore = 0;
let timeLeft = 30;
let gameActive = false;
let gameTimer = null;
let hits = 0;
// Initialize
loadFastestHit();
loadMaxScore();
onLoad();
function loadFastestHit() {
    const saved = sessionStorage.getItem('fastestHit');
    fastDisplay.textContent = saved ? `Fastest: ${saved}ms` : "Fastest: ---";
}

function onLoad(){
    lastGame.textContent = sessionStorage.getItem('lastScore')
}
// Load max score from localStorage
function loadMaxScore() {

    const saved = localStorage.getItem('whackAMoleMaxScore');
    maxScore = saved !== null ? parseInt(saved) : 0;
    maxScoreDisplay.innerText = maxScore;
}

// Save max score
function saveMaxScore() {
    if (score > maxScore) {

        maxScore = score;
        localStorage.setItem('whackAMoleMaxScore', maxScore);

        maxScoreDisplay.innerText = maxScore;


        maxScoreDisplay.style.textShadow = "0 0 20px gold, 0 0 40px gold";

        // Remove glow after 1s
        setTimeout(() => {
            maxScoreDisplay.style.textShadow = "none";
        }, 1000);
    }
}


// Random hole selection
function randomHole() {
    const randomIndex = Math.floor(Math.random() * holes.length);
    return holes[randomIndex];
}

// Random time
function randomTime(min, max) {
    return Math.random() * (max - min) + min;
}

// Pop up mole
function popUp() {
    if (!gameActive) return;
    
    let time = randomTime(500, 1500);
    const hole = randomHole();
    const mole = hole.querySelector('.mole');
    // TASK - 4 = Mole Speed Increases (Time Left < 10)

    if(timeLeft < 10){
       time =  randomTime(300,800);
    }
   mole.classList.add('up');
moleStartTime = Date.now();  // NEW

    
    setTimeout(function() {
        mole.classList.remove('up');
        if (gameActive) popUp();
    }, time);
}

// Bonk mole
function bonk(event) {

    if (!event.isTrusted) return;
    if (!this.classList.contains('up')) return;

    // VALID HIT → now measure reaction time
    const timeTaken = Date.now() - moleStartTime;

    let fastest = sessionStorage.getItem('fastestHit');
    fastest = fastest ? parseInt(fastest) : null;

    if (!fastest || timeTaken < fastest) {
        sessionStorage.setItem('fastestHit', timeTaken);
        fastDisplay.textContent = `Fastest: ${timeTaken}ms`;
    }

    // Count hits
    hits++;
    hitCounter.textContent = "Hits:" + hits;

    // Whack message
    message.textContent = "WHACK";
    message.style.opacity = "1";
    message.style.color = "white";

    if (score > 5) scoreDisplay.style.color = "gold";

    score++;
    scoreDisplay.innerText = score;

    this.classList.remove("up");
    this.classList.add("bonked");

    setTimeout(() => message.style.opacity = "0", 400);
    setTimeout(() => this.classList.remove("bonked"), 300);
}


// Start game
function startGame() {


    score = 0;
    timeLeft = 30;
    gameActive = true;
    scoreDisplay.innerText = 0;
    timeLeftDisplay.innerText = 30;
    startBtn.disabled = true;
    
    popUp();
    
    gameTimer = setInterval(function() {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0){
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    // TASK - 7 = "Last Game Score" Using sessionStorage
    sessionStorage.setItem('lastScore', score);
    lastGame.textContent = score;
    gameActive = false;
    clearInterval(gameTimer);
    startBtn.disabled = false;
    saveMaxScore();
    // TASK - 3 =  Start Button Says "Play Again"
    startBtn.innerText = "Play Again";
    if (score > maxScore) {
        alert(`🎉 New Record! Score: ${score}`);
    } else {
        alert(`Game Over! Score: ${score}`);
    }
}

// Event Listeners
moles.forEach(mole => mole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
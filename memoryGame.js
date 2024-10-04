const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};

const loadSound = (url) => {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => buffer)
        .catch(e => console.error("Error loading sound: ", e));
};

const preloadSounds = () => {
    const sounds = ['cow', 'donkey', 'monkey', 'pig'];
    sounds.forEach(sound => {
        loadSound(`./resources/sounds/${sound}.mp3`).then(buffer => {
            audioBuffers[sound] = buffer;
        });
    });
};

preloadSounds();

const playSound = (name) => {
    const buffer = audioBuffers[name];
    if (buffer) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
};
/* Using preloaded audio to stop crackling */

const animalButtons = ['cow', 'donkey', 'monkey', 'pig'];
let cpuArray = [];
let userChoiceArray = [];
let level = 0;
let levelNum = document.querySelector('#numOfLevels');
let playerScore = document.querySelector('#playerScore');
let ps = 0; // player score variable.

let memoryImage = document.getElementById('memimage');


// Function to make CPU choice and add to the sequence
const cpuChoice = function() {
    setTimeout(() => {
        cpuArray.push(animalButtons[Math.floor(Math.random() * 4)]);
        playSequence();
    }, 1000);
};

// This iterates the cpuArray and provides visual feedback
const playSequence = function() {
    for (let i = 0; i < cpuArray.length; i++) {
        setTimeout(() => {
            playSound(cpuArray[i]);
            $('#' + cpuArray[i]).fadeOut(250).fadeIn(250);
        }, i * 1000);
    }
};

// Player functionality
$(".btn").on("click", function () {
    let userChosenAnimal = this.id;
    if (animalButtons.includes(userChosenAnimal)) {
        userChoiceArray.push(userChosenAnimal);
        playSound(userChosenAnimal);
        animatePress(userChosenAnimal);
        checkUserInput();
    } else {
        console.error("Invalid animal selected");
    }
});


// Adds visual effect when user clicks image
const animatePress = (userChosenAnimal) => {
    if (animalButtons.includes(userChosenAnimal)) {
        $('#' + userChosenAnimal).addClass("pressed");
        setTimeout(() => {
            $('#' + userChosenAnimal).removeClass("pressed");
        }, 100);
    }
};


// Check to see if both arrays are the same length and match
const checkUserInput = () => {
    if (userChoiceArray.length === cpuArray.length) {
        let match = true;
        for (let i = 0; i < cpuArray.length; i++) {
            if (cpuArray[i] !== userChoiceArray[i]) {
                match = false;
                window.alert(`Game Over! You managed to get to level ${level} and achieved a high score of ${ps}`);
                break;
            }
        }
        if (match) {
            level += 1;
            ps += 50;
            levelNum.textContent = level;
            playerScore.textContent = ps;
            setMemoryImage(ps);
            userChoiceArray = [];
            setTimeout(cpuChoice, 1000);
        } else {
            console.log('You input the wrong sequence');
            level = 0;
            ps = 0;
            levelNum.textContent = level;
            playerScore.textContent = ps;
            userChoiceArray = [];
            cpuArray = [];
        }
        console.log(`This is level: ${level}`);
    }
};

const setMemoryImage = (score) => {
    if(score >= 1 && score <= 100){
        memoryImage.setAttribute('src', './resources/images/goldfish.png');
    } else if(score > 100 && score <= 300){
        memoryImage.setAttribute('src', './resources/images/dog.png');
    } else if(score > 300 && score <= 500){
        memoryImage.setAttribute('src', './resources/images/horse.png');
    } else if(score > 500){
        memoryImage.setAttribute('src', './resources/images/elephant.png');
    } else {
        memoryImage.setAttribute('src', '');
    }
};

// Initialise game start
const startGame = document.querySelector('#startGameBtn'); 
startGame.addEventListener('click', () => {
    level = 0;
    ps = 0;
    userChoiceArray = [];
    cpuArray = [];
    setMemoryImage(ps);
    cpuChoice(); // Call this function to start the sequence
    
});


const API_URL = 'https://random-word-api.vercel.app/api?words=1&length=5';
let randomWord = '';
let attempts = 0;

async function fetchRandomWord() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error('API is down');
        }

        randomWord = data[0].toUpperCase();
    } catch (error) {
        alert("API is down :p");
        resetGame();
    }
}

function createSquare(letter, color) {
    const square = document.createElement('div');
    square.className = 'square ' + color;
    square.textContent = letter;
    return square;
}

function checkGuess(guess) {
    let feedback = [];

    if (guess.length !== 5) return 'Please enter a 5-letter word.';

    attempts++;

    const guessArray = guess.split('');
    const wordArray = Array.from(randomWord);

    guessArray.forEach((letter, index) => {
        if (letter === randomWord[index]) {
            feedback[index] = { letter, color: 'correct' };
            wordArray[index] = null;
        } else {
            feedback[index] = { letter, color: null };
        }
    });

    guessArray.forEach((letter, index) => {
        if (!feedback[index].color) {
            const foundIndex = wordArray.indexOf(letter);
            if (foundIndex !== -1) {
                feedback[index] = { letter, color: 'wrong-position' };
                wordArray[foundIndex] = null;
            } else {
                feedback[index] = { letter, color: 'incorrect' };
            }
        }
    });

    return feedback;
}

function resetGame() {
    attempts = 0;
    randomWord = '';
    document.getElementById('grid').innerHTML = '';
    document.getElementById('guessInput').value = '';
    fetchRandomWord();
}

function submitGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.toUpperCase();
    const feedback = checkGuess(guess);
    const grid = document.getElementById('grid');

    feedback.forEach(({ letter, color }) => {
        const squareColor = color ? color : 'incorrect';
        const square = createSquare(letter, squareColor);
        grid.appendChild(square);
    });

    if (guess === randomWord) {
        alert(`Congratulations! You've guessed the word "${randomWord}" in ${attempts} attempts.`);
        resetGame();
    } else if (attempts >= 6) {
        alert(`Game over! The word was "${randomWord}".`);
        resetGame();
    }

    guessInput.value = '';
}

document.getElementById('submitGuess').addEventListener('click', submitGuess);

document.getElementById('guessInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitGuess();
        event.preventDefault();
    }
});

fetchRandomWord();
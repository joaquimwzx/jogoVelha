const cells = document.querySelectorAll('[data-cell]');
const restartBtn = document.getElementById('restartBtn');
const themeSelector = document.getElementById('theme');
const animalOptions = document.getElementById('animal-options');
const superheroOptions = document.getElementById('superhero-options');
const animalSelector = document.getElementById('animal');
const superheroSelector = document.getElementById('hero');

let gameActive = true;
let currentTheme = 'default';
let selectedAnimal = 'cat';
let selectedHero = 'superman';

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

themeSelector.addEventListener('change', (e) => {
    currentTheme = e.target.value;
    updateThemeOptions();
    startGame();
});

animalSelector.addEventListener('change', (e) => {
    selectedAnimal = e.target.value;
    startGame();
});

superheroSelector.addEventListener('change', (e) => {
    selectedHero = e.target.value;
    startGame();
});

function updateThemeOptions() {
    animalOptions.style.display = currentTheme === 'animals' ? 'block' : 'none';
    superheroOptions.style.display = currentTheme === 'superhero' ? 'block' : 'none';
}

function startGame() {
    gameActive = true;
    document.getElementById('message').textContent = '';

    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        cell.classList.remove('animate');
    });
}

function handleClick(e) {
    if (!gameActive) return;
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    placeMark(cell, 'x');
    animateCell(cell);

    if (checkWin('x')) {
        gameOver("Você venceu!");
        return;
    }

    if (isDraw()) {
        gameOver("Empate!");
        return;
    }

    setTimeout(computerMove, 300);
}

function computerMove() {
    const emptyCells = [...cells].filter(cell =>
        !cell.classList.contains('x') && !cell.classList.contains('o')
    );

    if (emptyCells.length === 0 || !gameActive) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(randomCell, 'o');
    animateCell(randomCell);

    if (checkWin('o')) {
        gameOver("A máquina venceu!");
        return;
    }

    if (isDraw()) {
        gameOver("Empate!");
    }
}

function placeMark(cell, mark) {
    cell.classList.add(mark);
    if (currentTheme === 'default') {
        cell.textContent = mark.toUpperCase();
    } else {
        setCellContent(cell, mark);
    }
}

function setCellContent(cell, mark) {
    if (currentTheme === 'superhero') {
        if (selectedHero === 'superman') {
            cell.textContent = mark === 'x' ? '🦸‍♂️' : '🦹‍♀️';
        } else if (selectedHero === 'batman') {
            cell.textContent = mark === 'x' ? '🦇' : '💀';
        } else if (selectedHero === 'wonderwoman') {
            cell.textContent = mark === 'x' ? '🦸‍♀️' : '⚔️';
        } else if (selectedHero === 'spiderman') {
            cell.textContent = mark === 'x' ? '🕷️' : '🕸️';
        }
    } else if (currentTheme === 'animals') {
        cell.textContent = mark === 'x'
            ? (selectedAnimal === 'cat' ? '🐱' : '🐶')
            : (selectedAnimal === 'cat' ? '🐶' : '🐱');
    } else if (currentTheme === 'emoji') {
        cell.textContent = mark === 'x' ? '😊' : '😢';
    }
}

function animateCell(cell) {
    cell.classList.add('animate');
    setTimeout(() => cell.classList.remove('animate'), 500);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination =>
        combination.every(index => cells[index].classList.contains(currentClass))
    );
}

function isDraw() {
    return [...cells].every(cell =>
        cell.classList.contains('x') || cell.classList.contains('o')
    );
}

function gameOver(message) {
    gameActive = false;
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    if (message === "Você venceu!") {
        // Redireciona para a página da carta
        window.location.href = "envelope.html";
    }
}

restartBtn.addEventListener('click', startGame);

startGame();

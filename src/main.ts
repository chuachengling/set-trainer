import './style.css';
import type { GameMode, Difficulty } from './types';
import { FindCardMode } from './findCardMode';
import { ValidateSetMode } from './validateSetMode';
import { StatisticsView } from './statisticsView';

const app = document.querySelector<HTMLDivElement>('#app')!;

let currentMode: GameMode = 'find-card';
let currentDifficulty: Difficulty = 'medium';
let currentGame: FindCardMode | ValidateSetMode | null = null;

function updateScore(score: number, total: number) {
  const scoreEl = document.querySelector('#score');
  if (scoreEl) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    scoreEl.textContent = `Score: ${score}/${total} (${percentage}%)`;
  }
}

function initApp() {
  app.innerHTML = `
    <div class="app-container">
      <header>
        <h1>SET Game Trainer</h1>
        <div class="header-controls">
          <button id="stats-btn" class="btn-stats">📊 Statistics</button>
          <div id="score" class="score">Score: 0/0 (0%)</div>
        </div>
      </header>
      
      <nav class="mode-selector">
        <button id="mode-find-card" class="mode-btn active">Find Completing Card</button>
        <button id="mode-validate-set" class="mode-btn">Validate SET</button>
      </nav>

      <div class="difficulty-selector">
        <span class="difficulty-label">Difficulty:</span>
        <button id="diff-super-easy" class="diff-btn">Super Easy (15s)</button>
        <button id="diff-easy" class="diff-btn">Easy (12s)</button>
        <button id="diff-medium" class="diff-btn active">Medium (7s)</button>
        <button id="diff-hard" class="diff-btn">Hard (3s)</button>
      </div>
      
      <main id="game-container"></main>
      <div id="stats-container"></div>
      
      <footer>
        <p>In the game of SET, a valid set consists of three cards where each property (color, shape, fill, count) is either all the same or all different across the three cards.</p>
      </footer>
    </div>
  `;

  const gameContainer = document.querySelector('#game-container') as HTMLElement;
  const statsContainer = document.querySelector('#stats-container') as HTMLElement;
  
  // Initialize game
  startGame();

  // Statistics button
  const statsBtn = document.querySelector('#stats-btn') as HTMLButtonElement;
  statsBtn.addEventListener('click', () => {
    new StatisticsView(statsContainer, () => {
      statsContainer.innerHTML = '';
    });
  });

  // Mode switching
  const findCardBtn = document.querySelector('#mode-find-card') as HTMLButtonElement;
  const validateSetBtn = document.querySelector('#mode-validate-set') as HTMLButtonElement;

  findCardBtn.addEventListener('click', () => {
    if (currentMode !== 'find-card') {
      currentMode = 'find-card';
      findCardBtn.classList.add('active');
      validateSetBtn.classList.remove('active');
      startGame();
    }
  });

  validateSetBtn.addEventListener('click', () => {
    if (currentMode !== 'validate-set') {
      currentMode = 'validate-set';
      validateSetBtn.classList.add('active');
      findCardBtn.classList.remove('active');
      startGame();
    }
  });

  // Difficulty switching
  const superEasyBtn = document.querySelector('#diff-super-easy') as HTMLButtonElement;
  const easyBtn = document.querySelector('#diff-easy') as HTMLButtonElement;
  const mediumBtn = document.querySelector('#diff-medium') as HTMLButtonElement;
  const hardBtn = document.querySelector('#diff-hard') as HTMLButtonElement;

  superEasyBtn.addEventListener('click', () => {
    if (currentDifficulty !== 'super-easy') {
      currentDifficulty = 'super-easy';
      updateDifficultyButtons();
      startGame();
    }
  });

  easyBtn.addEventListener('click', () => {
    if (currentDifficulty !== 'easy') {
      currentDifficulty = 'easy';
      updateDifficultyButtons();
      startGame();
    }
  });

  mediumBtn.addEventListener('click', () => {
    if (currentDifficulty !== 'medium') {
      currentDifficulty = 'medium';
      updateDifficultyButtons();
      startGame();
    }
  });

  hardBtn.addEventListener('click', () => {
    if (currentDifficulty !== 'hard') {
      currentDifficulty = 'hard';
      updateDifficultyButtons();
      startGame();
    }
  });

  function updateDifficultyButtons() {
    superEasyBtn.classList.toggle('active', currentDifficulty === 'super-easy');
    easyBtn.classList.toggle('active', currentDifficulty === 'easy');
    mediumBtn.classList.toggle('active', currentDifficulty === 'medium');
    hardBtn.classList.toggle('active', currentDifficulty === 'hard');
  }

  function startGame() {
    // Cleanup previous game
    if (currentGame && 'cleanup' in currentGame) {
      currentGame.cleanup();
    }

    updateScore(0, 0);

    if (currentMode === 'find-card') {
      currentGame = new FindCardMode(gameContainer, currentDifficulty, updateScore);
    } else {
      currentGame = new ValidateSetMode(gameContainer, currentDifficulty, updateScore);
    }
  }
}

initApp();


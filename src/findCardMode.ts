import type { Card, Difficulty } from './types';
import { DIFFICULTY_SETTINGS } from './types';
import { renderCard } from './cardRenderer';
import { generateFindCardPuzzle } from './setLogic';
import { statisticsManager } from './statistics';

export class FindCardMode {
  private container: HTMLElement;
  private baseCards: [Card, Card];
  private options: [Card, Card, Card];
  private correctIndex: number;
  private score: number = 0;
  private total: number = 0;
  private timeLimit: number;
  private timeRemaining: number;
  private timerInterval: number | null = null;
  private roundActive: boolean = false;
  private roundStartTime: number = 0;
  private difficulty: Difficulty;
  private isFirstRound: boolean = true;
  private onScoreUpdate: (score: number, total: number) => void;

  constructor(container: HTMLElement, difficulty: Difficulty, onScoreUpdate: (score: number, total: number) => void) {
    this.container = container;
    this.difficulty = difficulty;
    this.timeLimit = DIFFICULTY_SETTINGS[difficulty].timeLimit;
    this.timeRemaining = this.timeLimit;
    this.onScoreUpdate = onScoreUpdate;
    this.baseCards = [null!, null!];
    this.options = [null!, null!, null!];
    this.correctIndex = 0;
    this.startNewRound();
  }

  private startNewRound() {
    const puzzle = generateFindCardPuzzle();
    this.baseCards = puzzle.baseCards;
    this.options = puzzle.options;
    this.correctIndex = puzzle.correctIndex;
    this.timeRemaining = this.timeLimit;
    this.roundActive = false;
    this.render();
    
    // Auto-start after first round
    if (!this.isFirstRound) {
      this.beginRound();
    }
  }

  private beginRound() {
    this.roundActive = true;
    this.roundStartTime = Date.now();
    this.timeRemaining = this.timeLimit;
    this.isFirstRound = false;
    
    // Hide start button and show cards
    const startBtn = this.container.querySelector('#start-btn') as HTMLButtonElement;
    if (startBtn) {
      startBtn.style.display = 'none';
    }
    
    const cardsSection = this.container.querySelector('.cards-section') as HTMLElement;
    if (cardsSection) {
      cardsSection.style.display = 'block';
    }
    
    this.startTimer();
  }

  private startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = window.setInterval(() => {
      if (!this.roundActive) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        return;
      }

      this.timeRemaining -= 0.1;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.handleTimeout();
      }
    }, 100);
  }

  private updateTimerDisplay() {
    const timerEl = this.container.querySelector('.timer-display') as HTMLElement;
    if (timerEl) {
      const seconds = Math.max(0, this.timeRemaining).toFixed(1);
      timerEl.textContent = `${seconds}s`;
      
      // Color coding based on time remaining
      const percentage = (this.timeRemaining / this.timeLimit) * 100;
      if (percentage > 50) {
        timerEl.style.color = '#27ae60';
      } else if (percentage > 25) {
        timerEl.style.color = '#f39c12';
      } else {
        timerEl.style.color = '#e74c3c';
      }
    }
  }

  private handleTimeout() {
    this.roundActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const responseTime = (Date.now() - this.roundStartTime) / 1000;

    this.total++;
    this.score = Math.max(0, this.score - 1); // Deduct one point
    this.showFeedback('Time\'s up! -1 point', 'timeout');
    this.onScoreUpdate(this.score, this.total);

    // Record statistics
    statisticsManager.recordRound({
      mode: 'find-card',
      difficulty: this.difficulty,
      correct: false,
      timedOut: true,
      responseTime: responseTime,
      timestamp: Date.now()
    });

    // Disable all cards
    const cards = this.container.querySelectorAll('.clickable');
    cards.forEach(card => {
      card.classList.remove('clickable');
      (card as HTMLElement).style.pointerEvents = 'none';
    });

    // Highlight correct answer
    const optionsContainer = this.container.querySelector('.options') as HTMLElement;
    const correctCard = optionsContainer.children[this.correctIndex] as HTMLElement;
    correctCard.classList.add('correct-answer');

    // Start new round after delay
    setTimeout(() => {
      this.startNewRound();
    }, 2000);
  }

  private render() {
    const showStartButton = this.isFirstRound;
    const cardsDisplayStyle = showStartButton ? 'display: none;' : 'display: block;';
    
    this.container.innerHTML = `
      <div class="mode-container">
        <h2>Find the Completing Card</h2>
        <p class="instructions">Which card completes the SET with these two cards?</p>
        ${showStartButton ? '<button id="start-btn" class="btn btn-start">Start Round</button>' : ''}
        <div class="cards-section" style="${cardsDisplayStyle}">
          <div class="timer-container">
            <div class="timer-display">${this.timeLimit.toFixed(1)}s</div>
          </div>
          <div class="base-cards-section">
            <div class="section-label">Given Cards:</div>
            <div class="base-cards"></div>
          </div>
          <div class="options-section">
            <div class="section-label">Choose the Completing Card:</div>
            <div class="options"></div>
          </div>
        </div>
        <div class="feedback"></div>
      </div>
    `;

    if (showStartButton) {
      const startBtn = this.container.querySelector('#start-btn') as HTMLButtonElement;
      startBtn.addEventListener('click', () => this.beginRound());
    }

    const baseCardsContainer = this.container.querySelector('.base-cards') as HTMLElement;
    this.baseCards.forEach(card => {
      const cardEl = renderCard(card);
      baseCardsContainer.appendChild(cardEl);
    });

    const optionsContainer = this.container.querySelector('.options') as HTMLElement;
    this.options.forEach((card, index) => {
      const cardEl = renderCard(card);
      cardEl.classList.add('clickable');
      cardEl.addEventListener('click', () => this.handleCardClick(index));
      optionsContainer.appendChild(cardEl);
    });
  }

  private handleCardClick(index: number) {
    if (!this.roundActive) return;
    
    this.roundActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const responseTime = (Date.now() - this.roundStartTime) / 1000;

    this.total++;
    const correct = index === this.correctIndex;
    
    if (correct) {
      this.score++;
      this.showFeedback('Correct! ✓', 'correct');
    } else {
      this.showFeedback('Wrong! ✗', 'wrong');
    }
    
    this.onScoreUpdate(this.score, this.total);

    // Record statistics
    statisticsManager.recordRound({
      mode: 'find-card',
      difficulty: this.difficulty,
      correct: correct,
      timedOut: false,
      responseTime: responseTime,
      timestamp: Date.now()
    });
    
    // Disable all cards
    const cards = this.container.querySelectorAll('.clickable');
    cards.forEach(card => {
      card.classList.remove('clickable');
      (card as HTMLElement).style.pointerEvents = 'none';
    });
    
    // Highlight correct answer
    const optionsContainer = this.container.querySelector('.options') as HTMLElement;
    const correctCard = optionsContainer.children[this.correctIndex] as HTMLElement;
    correctCard.classList.add('correct-answer');
    
    // Start new round after delay
    setTimeout(() => {
      this.startNewRound();
    }, 1500);
  }

  private showFeedback(message: string, type: 'correct' | 'wrong' | 'timeout') {
    const feedback = this.container.querySelector('.feedback') as HTMLElement;
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    
    setTimeout(() => {
      feedback.className = 'feedback';
    }, type === 'timeout' ? 2000 : 1500);
  }

  public cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.roundActive = false;
  }

  public reset() {
    this.cleanup();
    this.score = 0;
    this.total = 0;
    this.onScoreUpdate(this.score, this.total);
    this.startNewRound();
  }
}

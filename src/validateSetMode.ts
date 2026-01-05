import type { Card, Difficulty } from './types';
import { DIFFICULTY_SETTINGS } from './types';
import { renderCard } from './cardRenderer';
import { generateValidateSetPuzzle } from './setLogic';
import { statisticsManager } from './statistics';

export class ValidateSetMode {
  private container: HTMLElement;
  private cards: [Card, Card, Card];
  private isSet: boolean;
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
    this.cards = [null!, null!, null!];
    this.isSet = false;
    this.startNewRound();
  }

  private startNewRound() {
    const puzzle = generateValidateSetPuzzle();
    this.cards = puzzle.cards;
    this.isSet = puzzle.isSet;
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
    
    const explanation = this.isSet 
      ? 'This was actually a valid SET!' 
      : 'This was not a valid SET!';
    this.showFeedback(`Time's up! -1 point. ${explanation}`, 'timeout');
    this.onScoreUpdate(this.score, this.total);

    // Record statistics
    statisticsManager.recordRound({
      mode: 'validate-set',
      difficulty: this.difficulty,
      correct: false,
      timedOut: true,
      responseTime: responseTime,
      timestamp: Date.now()
    });

    // Disable buttons
    const yesBtn = this.container.querySelector('#yes-btn') as HTMLButtonElement;
    const noBtn = this.container.querySelector('#no-btn') as HTMLButtonElement;
    if (yesBtn) yesBtn.disabled = true;
    if (noBtn) noBtn.disabled = true;

    // Start new round after delay
    setTimeout(() => {
      this.startNewRound();
    }, 2500);
  }

  private render() {
    const showStartButton = this.isFirstRound;
    const cardsDisplayStyle = showStartButton ? 'display: none;' : 'display: block;';
    
    this.container.innerHTML = `
      <div class="mode-container">
        <h2>Validate the SET</h2>
        <p class="instructions">Do these three cards form a valid SET?</p>
        ${showStartButton ? '<button id="start-btn" class="btn btn-start">Start Round</button>' : ''}
        <div class="cards-section" style="${cardsDisplayStyle}">
          <div class="timer-container">
            <div class="timer-display">${this.timeLimit.toFixed(1)}s</div>
          </div>
          <div class="cards-display"></div>
          <div class="buttons">
            <button id="yes-btn" class="btn btn-yes">Yes, it's a SET</button>
            <button id="no-btn" class="btn btn-no">No, it's not a SET</button>
          </div>
        </div>
        <div class="feedback"></div>
      </div>
    `;

    if (showStartButton) {
      const startBtn = this.container.querySelector('#start-btn') as HTMLButtonElement;
      startBtn.addEventListener('click', () => this.beginRound());
    }

    const cardsContainer = this.container.querySelector('.cards-display') as HTMLElement;
    this.cards.forEach(card => {
      const cardEl = renderCard(card);
      cardsContainer.appendChild(cardEl);
    });

    const yesBtn = this.container.querySelector('#yes-btn') as HTMLButtonElement;
    const noBtn = this.container.querySelector('#no-btn') as HTMLButtonElement;
    
    yesBtn.addEventListener('click', () => this.handleAnswer(true));
    noBtn.addEventListener('click', () => this.handleAnswer(false));
  }

  private handleAnswer(userAnswer: boolean) {
    if (!this.roundActive) return;
    
    this.roundActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const responseTime = (Date.now() - this.roundStartTime) / 1000;

    this.total++;
    const correct = userAnswer === this.isSet;
    
    if (correct) {
      this.score++;
      this.showFeedback('Correct! ✓', 'correct');
    } else {
      const explanation = this.isSet 
        ? 'This was actually a valid SET!' 
        : 'This was not a valid SET!';
      this.showFeedback(`Wrong! ✗ ${explanation}`, 'wrong');
    }
    
    this.onScoreUpdate(this.score, this.total);

    // Record statistics
    statisticsManager.recordRound({
      mode: 'validate-set',
      difficulty: this.difficulty,
      correct: correct,
      timedOut: false,
      responseTime: responseTime,
      timestamp: Date.now()
    });
    
    // Disable buttons
    const yesBtn = this.container.querySelector('#yes-btn') as HTMLButtonElement;
    const noBtn = this.container.querySelector('#no-btn') as HTMLButtonElement;
    yesBtn.disabled = true;
    noBtn.disabled = true;
    
    // Start new round after delay
    setTimeout(() => {
      this.startNewRound();
    }, 2000);
  }

  private showFeedback(message: string, type: 'correct' | 'wrong' | 'timeout') {
    const feedback = this.container.querySelector('.feedback') as HTMLElement;
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    
    setTimeout(() => {
      feedback.className = 'feedback';
    }, type === 'timeout' ? 2500 : 2000);
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

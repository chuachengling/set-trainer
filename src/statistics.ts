import type { GameMode, Difficulty } from './types';

export interface RoundResult {
  mode: GameMode;
  difficulty: Difficulty;
  correct: boolean;
  timedOut: boolean;
  responseTime: number; // in seconds
  timestamp: number;
}

export interface Statistics {
  totalRounds: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeouts: number;
  averageResponseTime: number;
  byMode: {
    [key in GameMode]: {
      total: number;
      correct: number;
      wrong: number;
      timeouts: number;
      averageResponseTime: number;
    };
  };
  byDifficulty: {
    [key in Difficulty]: {
      total: number;
      correct: number;
      wrong: number;
      timeouts: number;
      averageResponseTime: number;
    };
  };
  history: RoundResult[];
}

class StatisticsManager {
  private static STORAGE_KEY = 'set-trainer-statistics';
  private stats: Statistics;

  constructor() {
    this.stats = this.loadStats();
  }

  private loadStats(): Statistics {
    const stored = localStorage.getItem(StatisticsManager.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, return default stats
      }
    }
    return this.getDefaultStats();
  }

  private getDefaultStats(): Statistics {
    return {
      totalRounds: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeouts: 0,
      averageResponseTime: 0,
      byMode: {
        'find-card': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        },
        'validate-set': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        }
      },
      byDifficulty: {
        'super-easy': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        },
        'easy': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        },
        'medium': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        },
        'hard': {
          total: 0,
          correct: 0,
          wrong: 0,
          timeouts: 0,
          averageResponseTime: 0
        }
      },
      history: []
    };
  }

  private saveStats(): void {
    localStorage.setItem(StatisticsManager.STORAGE_KEY, JSON.stringify(this.stats));
  }

  public recordRound(result: RoundResult): void {
    // Update overall stats
    this.stats.totalRounds++;
    if (result.timedOut) {
      this.stats.timeouts++;
    } else if (result.correct) {
      this.stats.correctAnswers++;
    } else {
      this.stats.wrongAnswers++;
    }

    // Update mode stats
    const modeStats = this.stats.byMode[result.mode];
    modeStats.total++;
    if (result.timedOut) {
      modeStats.timeouts++;
    } else if (result.correct) {
      modeStats.correct++;
    } else {
      modeStats.wrong++;
    }

    // Update difficulty stats
    const diffStats = this.stats.byDifficulty[result.difficulty];
    diffStats.total++;
    if (result.timedOut) {
      diffStats.timeouts++;
    } else if (result.correct) {
      diffStats.correct++;
    } else {
      diffStats.wrong++;
    }

    // Update response times
    if (!result.timedOut) {
      const totalResponseTime = this.stats.averageResponseTime * (this.stats.totalRounds - 1 - this.stats.timeouts);
      this.stats.averageResponseTime = (totalResponseTime + result.responseTime) / (this.stats.totalRounds - this.stats.timeouts);

      const modeResponseTime = modeStats.averageResponseTime * (modeStats.total - 1 - modeStats.timeouts);
      modeStats.averageResponseTime = (modeResponseTime + result.responseTime) / (modeStats.total - modeStats.timeouts);

      const diffResponseTime = diffStats.averageResponseTime * (diffStats.total - 1 - diffStats.timeouts);
      diffStats.averageResponseTime = (diffResponseTime + result.responseTime) / (diffStats.total - diffStats.timeouts);
    }

    // Add to history (keep last 100 rounds)
    this.stats.history.push(result);
    if (this.stats.history.length > 100) {
      this.stats.history.shift();
    }

    this.saveStats();
  }

  public getStats(): Statistics {
    return { ...this.stats };
  }

  public clearStats(): void {
    this.stats = this.getDefaultStats();
    this.saveStats();
  }
}

export const statisticsManager = new StatisticsManager();

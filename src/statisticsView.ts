import { statisticsManager, type Statistics } from './statistics';

export class StatisticsView {
  private container: HTMLElement;
  private onClose: () => void;

  constructor(container: HTMLElement, onClose: () => void) {
    this.container = container;
    this.onClose = onClose;
    this.render();
  }

  private render() {
    const stats = statisticsManager.getStats();
    
    this.container.innerHTML = `
      <div class="stats-overlay">
        <div class="stats-modal">
          <div class="stats-header">
            <h2>📊 Statistics</h2>
            <button id="close-stats" class="btn-close">✕</button>
          </div>
          
          <div class="stats-content">
            ${this.renderOverallStats(stats)}
            ${this.renderModeStats(stats)}
            ${this.renderDifficultyStats(stats)}
            
            <div class="stats-actions">
              <button id="clear-stats" class="btn btn-danger">Clear All Statistics</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const closeBtn = this.container.querySelector('#close-stats');
    closeBtn?.addEventListener('click', () => this.onClose());

    const clearBtn = this.container.querySelector('#clear-stats');
    clearBtn?.addEventListener('click', () => this.handleClearStats());

    // Close on overlay click
    const overlay = this.container.querySelector('.stats-overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.onClose();
      }
    });
  }

  private renderOverallStats(stats: Statistics): string {
    const accuracy = stats.totalRounds > 0 
      ? ((stats.correctAnswers / stats.totalRounds) * 100).toFixed(1)
      : '0.0';
    
    const avgTime = stats.averageResponseTime > 0
      ? stats.averageResponseTime.toFixed(2)
      : '0.00';

    return `
      <div class="stats-section">
        <h3>Overall Performance</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalRounds}</div>
            <div class="stat-label">Total Rounds</div>
          </div>
          <div class="stat-card success">
            <div class="stat-value">${stats.correctAnswers}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-card error">
            <div class="stat-value">${stats.wrongAnswers}</div>
            <div class="stat-label">Wrong</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-value">${stats.timeouts}</div>
            <div class="stat-label">Timeouts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${accuracy}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${avgTime}s</div>
            <div class="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderModeStats(stats: Statistics): string {
    const findCardStats = stats.byMode['find-card'];
    const validateSetStats = stats.byMode['validate-set'];

    const findCardAccuracy = findCardStats.total > 0
      ? ((findCardStats.correct / findCardStats.total) * 100).toFixed(1)
      : '0.0';
    
    const validateSetAccuracy = validateSetStats.total > 0
      ? ((validateSetStats.correct / validateSetStats.total) * 100).toFixed(1)
      : '0.0';

    return `
      <div class="stats-section">
        <h3>By Game Mode</h3>
        <div class="stats-table">
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Played</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Timeouts</th>
                <th>Accuracy</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Find Completing Card</td>
                <td>${findCardStats.total}</td>
                <td class="success">${findCardStats.correct}</td>
                <td class="error">${findCardStats.wrong}</td>
                <td class="warning">${findCardStats.timeouts}</td>
                <td>${findCardAccuracy}%</td>
                <td>${findCardStats.averageResponseTime.toFixed(2)}s</td>
              </tr>
              <tr>
                <td>Validate SET</td>
                <td>${validateSetStats.total}</td>
                <td class="success">${validateSetStats.correct}</td>
                <td class="error">${validateSetStats.wrong}</td>
                <td class="warning">${validateSetStats.timeouts}</td>
                <td>${validateSetAccuracy}%</td>
                <td>${validateSetStats.averageResponseTime.toFixed(2)}s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private renderDifficultyStats(stats: Statistics): string {
    const difficulties: Array<{ key: 'easy' | 'medium' | 'hard', label: string }> = [
      { key: 'easy', label: 'Easy' },
      { key: 'medium', label: 'Medium' },
      { key: 'hard', label: 'Hard' }
    ];

    const rows = difficulties.map(({ key, label }) => {
      const diffStats = stats.byDifficulty[key];
      const accuracy = diffStats.total > 0
        ? ((diffStats.correct / diffStats.total) * 100).toFixed(1)
        : '0.0';
      
      return `
        <tr>
          <td>${label}</td>
          <td>${diffStats.total}</td>
          <td class="success">${diffStats.correct}</td>
          <td class="error">${diffStats.wrong}</td>
          <td class="warning">${diffStats.timeouts}</td>
          <td>${accuracy}%</td>
          <td>${diffStats.averageResponseTime.toFixed(2)}s</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="stats-section">
        <h3>By Difficulty</h3>
        <div class="stats-table">
          <table>
            <thead>
              <tr>
                <th>Difficulty</th>
                <th>Played</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Timeouts</th>
                <th>Accuracy</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private handleClearStats() {
    if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
      statisticsManager.clearStats();
      this.render();
    }
  }
}

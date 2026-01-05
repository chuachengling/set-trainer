import type { Card } from './types';

export function renderCard(card: Card): HTMLDivElement {
  const cardEl = document.createElement('div');
  cardEl.className = 'set-card';
  
  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'shapes-container';
  
  for (let i = 0; i < card.count; i++) {
    const shape = createShape(card.shape, card.color, card.fill);
    shapesContainer.appendChild(shape);
  }
  
  cardEl.appendChild(shapesContainer);
  return cardEl;
}

function createShape(shape: string, color: string, fill: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 60');
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '60');
  
  let pathD: string;
  
  switch (shape) {
    case 'diamond':
      pathD = 'M 50 5 L 90 30 L 50 55 L 10 30 Z';
      break;
    case 'oval':
      pathD = 'M 20 30 Q 20 10 50 10 Q 80 10 80 30 Q 80 50 50 50 Q 20 50 20 30 Z';
      break;
    case 'squiggle':
      pathD = 'M 20 40 Q 10 30 20 20 Q 30 10 50 15 Q 70 20 80 15 Q 90 20 80 30 Q 70 40 50 35 Q 30 30 20 40 Z';
      break;
    default:
      pathD = '';
  }
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  
  const colorMap: { [key: string]: string } = {
    red: '#e74c3c',
    green: '#27ae60',
    purple: '#9b59b6'
  };
  
  const strokeColor = colorMap[color] || '#000';
  path.setAttribute('stroke', strokeColor);
  path.setAttribute('stroke-width', '2');
  
  switch (fill) {
    case 'solid':
      path.setAttribute('fill', strokeColor);
      break;
    case 'striped':
      const patternId = `pattern-${color}-${Math.random().toString(36).substr(2, 9)}`;
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttribute('id', patternId);
      pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      pattern.setAttribute('width', '4');
      pattern.setAttribute('height', '4');
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '0');
      line.setAttribute('x2', '0');
      line.setAttribute('y2', '4');
      line.setAttribute('stroke', strokeColor);
      line.setAttribute('stroke-width', '2');
      
      pattern.appendChild(line);
      defs.appendChild(pattern);
      svg.appendChild(defs);
      
      path.setAttribute('fill', `url(#${patternId})`);
      break;
    case 'empty':
      path.setAttribute('fill', 'none');
      break;
  }
  
  svg.appendChild(path);
  return svg;
}

import type { Card, Color, Shape, Fill, Count } from './types';

// Check if three cards form a valid SET
export function isValidSet(card1: Card, card2: Card, card3: Card): boolean {
  const colors = [card1.color, card2.color, card3.color];
  const shapes = [card1.shape, card2.shape, card3.shape];
  const fills = [card1.fill, card2.fill, card3.fill];
  const counts = [card1.count, card2.count, card3.count];

  return (
    isValidProperty(colors) &&
    isValidProperty(shapes) &&
    isValidProperty(fills) &&
    isValidProperty(counts)
  );
}

// A property is valid if all three are the same OR all three are different
function isValidProperty<T>(values: T[]): boolean {
  const allSame = values[0] === values[1] && values[1] === values[2];
  const allDifferent = values[0] !== values[1] && values[1] !== values[2] && values[0] !== values[2];
  return allSame || allDifferent;
}

// Generate all possible cards (81 total)
export function generateAllCards(): Card[] {
  const colors: Color[] = ['red', 'green', 'purple'];
  const shapes: Shape[] = ['diamond', 'oval', 'squiggle'];
  const fills: Fill[] = ['solid', 'striped', 'empty'];
  const counts: Count[] = [1, 2, 3];

  const cards: Card[] = [];
  for (const color of colors) {
    for (const shape of shapes) {
      for (const fill of fills) {
        for (const count of counts) {
          cards.push({ color, shape, fill, count });
        }
      }
    }
  }
  return cards;
}

// Get a random card
export function getRandomCard(exclude: Card[] = []): Card {
  const allCards = generateAllCards();
  const available = allCards.filter(card => 
    !exclude.some(exc => cardsEqual(card, exc))
  );
  return available[Math.floor(Math.random() * available.length)];
}

// Check if two cards are equal
export function cardsEqual(card1: Card, card2: Card): boolean {
  return (
    card1.color === card2.color &&
    card1.shape === card2.shape &&
    card1.fill === card2.fill &&
    card1.count === card2.count
  );
}

// Find a card that completes a set with two given cards
export function findCompletingCard(card1: Card, card2: Card): Card {
  const allCards = generateAllCards();
  
  for (const card of allCards) {
    if (isValidSet(card1, card2, card)) {
      return card;
    }
  }
  
  // This should never happen as there's always a completing card
  throw new Error('No completing card found');
}

// Generate random cards for Mode 1: Find the completing card
export function generateFindCardPuzzle(): { baseCards: [Card, Card], options: [Card, Card, Card], correctIndex: number } {
  const card1 = getRandomCard();
  const card2 = getRandomCard([card1]);
  const correctCard = findCompletingCard(card1, card2);
  
  // Generate two incorrect options
  const wrongCard1 = getRandomCard([card1, card2, correctCard]);
  const wrongCard2 = getRandomCard([card1, card2, correctCard, wrongCard1]);
  
  // Randomly shuffle the options
  const options: [Card, Card, Card] = [correctCard, wrongCard1, wrongCard2];
  const correctIndex = Math.floor(Math.random() * 3);
  
  // Move correct card to the chosen position
  [options[0], options[correctIndex]] = [options[correctIndex], options[0]];
  
  return {
    baseCards: [card1, card2],
    options,
    correctIndex
  };
}

// Generate random cards for Mode 2: Validate if it's a set
export function generateValidateSetPuzzle(): { cards: [Card, Card, Card], isSet: boolean } {
  const isSet = Math.random() < 0.5;
  
  if (isSet) {
    // Generate a valid set
    const card1 = getRandomCard();
    const card2 = getRandomCard([card1]);
    const card3 = findCompletingCard(card1, card2);
    return { cards: [card1, card2, card3], isSet: true };
  } else {
    // Generate three random cards that don't form a set
    let card1: Card, card2: Card, card3: Card;
    do {
      card1 = getRandomCard();
      card2 = getRandomCard([card1]);
      card3 = getRandomCard([card1, card2]);
    } while (isValidSet(card1, card2, card3));
    
    return { cards: [card1, card2, card3], isSet: false };
  }
}

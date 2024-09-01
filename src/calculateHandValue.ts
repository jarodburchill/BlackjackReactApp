import {Card} from './sharedTypes'

const faceCards = ['K', 'Q', 'J']

const calculateHandValue = (cards: Card[]) => {
  let total = 0;
  const visibleCards = cards.filter(card => !card.hidden)
  visibleCards.forEach((card) => {
    if (card.value !== 'A') {
      total += faceCards.includes(card.value) ? 10 : Number(card.value);
    }
  });
  const aces = visibleCards.filter((card) => card.value === 'A');
  aces.forEach((card) => {
    if ((total + 11) > 21) {
      total += 1;
    }
    else if ((total + 11) === 21) {
      if (aces.length > 1) {
        total += 1;
      }
      else {
        total += 11;
      }
    }
    else {
      total += 11;
    }
  });

  return total;
}

export default calculateHandValue
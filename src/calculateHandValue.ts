import Card from './card'

const calculateHandValue = (cards: Card[]) => {
  let total = 0;
  cards.forEach((card: any) => {
    if (card.hidden === false && card.value !== 'A') {
      switch (card.value) {
        case 'K':
          total += 10;
          break;
        case 'Q':
          total += 10;
          break;
        case 'J':
          total += 10;
          break;
        default:
          total += Number(card.value);
          break;
      }
    }
  });
  const aces = cards.filter((card: any) => {
    return card.value === 'A';
  });
  aces.forEach((card: any) => {
    if (card.hidden === false) {
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
    }
  });

  return total;
}

export default calculateHandValue
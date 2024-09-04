import React from 'react';
import { Card, Suit } from '../sharedTypes';
import styles from './styles/Card.module.css';

const suitIcons: Record<Suit, string> = {
  [Suit.spades]: '♠',
  [Suit.diamonds]: '♦',
  [Suit.clubs]: '♣',
  [Suit.hearts]: '♥'
}

// TODO: rename?
const CardComponent: React.FC<Card> = ({ value, suit, hidden }) => {
  const getColor = () => {
    if (suit === Suit.clubs || suit === Suit.spades) {
      return styles.black;
    }
    else {
      return styles.red;
    }
  }

  if (hidden) {
    return (
      <div className={styles.hiddenCard} />
    );
  } else {
    return (
      <div className={styles.card}>
        <div className={getColor()}>
          <h1 className={styles.value}>{value}</h1>
          <h1 className={styles[suitIcons[suit]]}>{suitIcons[suit]}</h1>
        </div>
      </div>
    );
  }
}

export default CardComponent;
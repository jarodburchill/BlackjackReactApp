import React from 'react';
import styles from './styles/Hand.module.css';
import CardComponent from './Card';
import Card from '../card';

type HandProps = {
  title: string,
  cards: Card[]
};

const Hand: React.FC<HandProps> = ({ title, cards }) => {
  const getTitle = () => {
    if (cards.length > 0) {
      return (
        <h1 className={styles.title}>{title}</h1>
      );
    }
  }
  return (
    <div className={styles.handContainer}>
      {getTitle()}
      <div className={styles.cardContainer}>
        {cards.map((card: any, index: number) => {
          return (
            <CardComponent key={index} value={card.value} suit={card.suit} hidden={card.hidden} />
          );
        })}
      </div>
    </div>
  );
}

export default Hand;
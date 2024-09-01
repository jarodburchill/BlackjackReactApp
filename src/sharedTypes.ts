export enum Suit {
  'spades', 'diamonds', 'clubs', 'hearts'
}

export type Card = {
  value: string,
  suit: Suit,
  hidden?: boolean
}

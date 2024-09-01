import { Card, Suit } from './sharedTypes'

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K']
const suits = [Suit.hearts, Suit.diamonds, Suit.spades, Suit.clubs]

const deck: Card[] = values.flatMap(value =>
  suits.map(suit => ({ value, suit }))
)


export default deck
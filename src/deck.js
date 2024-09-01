const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K']
const suits = ['spades', 'diamonds', 'clubs', 'hearts']

const deck = values.flatMap(value => suits.map(suit => ({value, suit})))

export default deck
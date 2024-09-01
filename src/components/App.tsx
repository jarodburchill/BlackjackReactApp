import React, { useState, useEffect, useCallback } from 'react';
import Status from './Status';
import Controls from './Controls';
import Hand from './Hand';
import {Card, Suit} from '../sharedTypes'
import standardDeck from '../deck';
import calculateHandValue from '../calculateHandValue';

enum GameState {
  bet,
  init,
  userTurn,
  dealerTurn,
  handEnded
}

enum Deal {
  user,
  dealer,
  hidden
}

enum Message {
  bet = 'Place a Bet!',
  hitStand = 'Hit or Stand?',
  bust = 'Bust!',
  userWin = 'You Win!',
  dealerWin = 'Dealer Wins!',
  tie = 'Tie!'
}

const App: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>(standardDeck);

  const [userCards, setUserCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);

  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(0);

  const [gameState, setGameState] = useState(GameState.bet);
  const [message, setMessage] = useState(Message.bet);
  const [buttonState, setButtonState] = useState({
    hitDisabled: false,
    standDisabled: false,
    resetDisabled: true
  });

  const dealerScore = calculateHandValue(dealerCards)
  const userScore = calculateHandValue(userCards)

  const resetGame = () => {
    console.clear();
    setDeck(standardDeck);

    setUserCards([]);

    setDealerCards([]);

    setBet(0);

    setGameState(GameState.bet);
    setMessage(Message.bet);
    setButtonState({
      hitDisabled: false,
      standDisabled: false,
      resetDisabled: true
    });
  }

  const placeBet = (amount: number) => {
    setBet(amount);
    setBalance(Math.round((balance - amount) * 100) / 100);
    setGameState(GameState.init);
  }

  const dealCard = useCallback((dealType: Deal, value: string, suit: Suit) => {
    switch (dealType) {
      case Deal.user:
        userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setUserCards([...userCards]);
        break;
      case Deal.dealer:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
        setDealerCards([...dealerCards]);
        break;
      case Deal.hidden:
        dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
        setDealerCards([...dealerCards]);
        break;
      default:
        break;
    }
  }, [dealerCards, userCards])

  const drawCard = useCallback((dealType: Deal) => {
    if (deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck[randomIndex];
      deck.splice(randomIndex, 1);
      setDeck([...deck]);
      console.log('Remaining Cards:', deck.length);
      dealCard(dealType, card.value, card.suit);
    }
    else {
      alert('All cards have been drawn');
    }
  }, [dealCard, deck])

  const revealCard = () => {
    dealerCards.filter((card) => {
      if (card.hidden === true) {
        card.hidden = false;
      }
      return card;
    });
    setDealerCards([...dealerCards])
  }

  const hit = () => {
    drawCard(Deal.user);
  }

  const stand = () => {
    setButtonState({ hitDisabled: true, standDisabled: true, resetDisabled: false });
    setGameState(GameState.dealerTurn);
    revealCard();
  }

  const bust = useCallback(() => {
    setButtonState({ hitDisabled: true, standDisabled: true, resetDisabled: false });
    setMessage(Message.bust);
  }, [])

  const checkWin = useCallback(() => {
    if (userScore > dealerScore || dealerScore > 21) {
      setBalance(currentBalance => Math.round((currentBalance + (bet * 2)) * 100) / 100);
      setMessage(Message.userWin);
      setGameState(GameState.handEnded);
    }
    else if (dealerScore > userScore) {
      setMessage(Message.dealerWin);
    }
    else {
      setBalance(currentBalance => Math.round((currentBalance + (bet * 1)) * 100) / 100);
      setMessage(Message.tie);
    }
  }, [bet, dealerScore, userScore])

  useEffect(() => {
    if (gameState === GameState.init) {
      drawCard(Deal.user);
      drawCard(Deal.hidden);
      drawCard(Deal.user);
      drawCard(Deal.dealer);
      setGameState(GameState.userTurn);
      setMessage(Message.hitStand);
    }
  }, [drawCard, gameState]);

  useEffect(() => {
    if (gameState === GameState.userTurn) {
      if (userScore === 21) {
        setButtonState(prevButtonState => ({ ...prevButtonState, hitDisabled: true }));
      }
      else if (userScore > 21) {
        bust();
      }
    }
  }, [bust, gameState, userScore]);

  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      }
      else {
        drawCard(Deal.dealer);
      }
    }
  }, [checkWin, drawCard, dealerScore, gameState]);

  return (
    <>
      <Status message={message} balance={balance} />
      <Controls
        balance={balance}
        gameState={gameState}
        buttonState={buttonState}
        betEvent={placeBet}
        hitEvent={hit}
        standEvent={stand}
        resetEvent={resetGame}
      />
      <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
      <Hand title={`Your Hand (${userScore})`} cards={userCards} />
    </>
  );
}

export default App;

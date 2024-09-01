import React, { useState, useEffect, useCallback } from 'react';
import Status from './Status';
import Controls from './Controls';
import Hand from './Hand';
import standardDeck from '../deck.js';
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
  const [deck, setDeck]: any[] = useState(standardDeck);

  const [userCards, setUserCards]: any[] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards]: any[] = useState([]);
  const [dealerCount, setDealerCount] = useState(0);

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
    setUserCount(0);

    setDealerCards([]);
    setDealerCount(0);

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

  const dealCard = useCallback((dealType: Deal, value: string, suit: string) => {
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
      switch (card.suit) {
        case 'spades':
          dealCard(dealType, card.value, '♠');
          break;
        case 'diamonds':
          dealCard(dealType, card.value, '♦');
          break;
        case 'clubs':
          dealCard(dealType, card.value, '♣');
          break;
        case 'hearts':
          dealCard(dealType, card.value, '♥');
          break;
        default:
          break;
      }
    }
    else {
      alert('All cards have been drawn');
    }
  }, [dealCard, deck])

  const revealCard = () => {
    dealerCards.filter((card: any) => {
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
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setGameState(GameState.dealerTurn);
    revealCard();
  }

  const bust = useCallback(() => {
    buttonState.hitDisabled = true;
    buttonState.standDisabled = true;
    buttonState.resetDisabled = false;
    setButtonState({ ...buttonState });
    setMessage(Message.bust);
  }, [buttonState])

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
    setUserCount(userCount + 1);
  }, [userCards, userCount]);

  useEffect(() => {
    setDealerCount(dealerCount + 1);
  }, [dealerCards, dealerCount]);

  useEffect(() => {
    if (gameState === GameState.userTurn) {
      if (userScore === 21) {
        buttonState.hitDisabled = true;
        setButtonState({ ...buttonState });
      }
      else if (userScore > 21) {
        bust();
      }
    }
  }, [bust, buttonState, gameState, userCount, userScore]);

  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      }
      else {
        drawCard(Deal.dealer);
      }
    }
  }, [checkWin, dealerCount, dealerScore, drawCard, gameState]);

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

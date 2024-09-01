import React, { useState, useEffect } from 'react';
import styles from './styles/Controls.module.css';

type ControlsProps = {
  balance: number,
  gameState: number,
  buttonState: { hitDisabled: boolean, standDisabled: boolean, resetDisabled: boolean },
  onBet: (amount: number) => void,
  onHit: () => void,
  onStand: () => void,
  onReset: () => void
};

const validateBet = (betAmount: number, balance: number) => {
  return betAmount <= balance && betAmount >= 0.01
}

const Controls: React.FC<ControlsProps> = ({ balance, gameState, buttonState, onBet: betEvent, onHit: hitEvent, onStand: standEvent, onReset: resetEvent }) => {
  const [amount, setAmount] = useState(10);
  const [inputStyle, setInputStyle] = useState(styles.input);

  useEffect(() => {
    if (validateBet(amount, balance) === false) {
      setInputStyle(styles.inputError);
    } else {
      setInputStyle(styles.input);
    }
  }, [amount, balance]);

  const onBetClick = () => {
    if (validateBet(amount, balance) === false) {
      setInputStyle(styles.inputError);
    } else {
      betEvent(Math.round(amount * 100) / 100);

      setInputStyle(styles.input);
    }
  }

  if (gameState === 0) {
    return (
      <div className={styles.controlsContainer}>
        <div className={styles.betContainer}>
          <h4>Amount:</h4>
          <input
            autoFocus type='number' value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} className={inputStyle}
          />
        </div>
        <button onClick={() => onBetClick()} className={styles.button}>Bet</button>
      </div>
    );
  } else {
    return (
      <div className={styles.controlsContainer}>
        <button onClick={() => hitEvent()} disabled={buttonState.hitDisabled} className={styles.button}>Hit</button>
        <button onClick={() => standEvent()} disabled={buttonState.standDisabled} className={styles.button}>Stand</button>
        <button onClick={() => resetEvent()} disabled={buttonState.resetDisabled} className={styles.button}>Reset</button>
      </div>
    );
  }
}

export default Controls;
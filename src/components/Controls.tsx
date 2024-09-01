import React, { useState, useEffect } from 'react';
import styles from './styles/Controls.module.css';

type ControlsProps = {
  balance: number,
  gameState: number,
  buttonState: {hitDisabled: boolean, standDisabled: boolean, resetDisabled: boolean},
  betEvent: (amount: number) => void,
  hitEvent: () => void,
  standEvent: () => void,
  resetEvent: () => void
};

const Controls: React.FC<ControlsProps> = ({ balance, gameState, buttonState, betEvent, hitEvent, standEvent, resetEvent }) => {
  const [amount, setAmount] = useState(10);
  const [inputStyle, setInputStyle] = useState(styles.input);

  useEffect(() => {
    validation();
  }, [amount, balance]);

  const validation = () => {
    if (amount > balance) {
      setInputStyle(styles.inputError);
      return false;
    }
    if (amount < 0.01) {
      setInputStyle(styles.inputError);
      return false;
    }
    setInputStyle(styles.input);
    return true;
  }

  const onBetClick = () => {
    if (validation()) {
      betEvent(Math.round(amount * 100) / 100);
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
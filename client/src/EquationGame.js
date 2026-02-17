import React, { useState } from 'react';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation() {
  const x = getRandomInt(1, 9);
  const k = getRandomInt(2, 5);
  const m = getRandomInt(3, 7);
  const z = k * x + m;
  return { x, k, m, z };
}

function Ball() {
  return <span style={{ fontSize: 32, margin: '0 4px' }}>⚽️</span>;
}

function Weights({ value }) {
  // Split weights into 5s and 1s for visualization
  let weights = [];
  let left = value;
  while (left >= 5) { weights.push(5); left -= 5; }
  while (left > 0) { weights.push(1); left -= 1; }
  return (
    <span>
      {weights.map((w, i) => (
        <span key={i} style={{ fontSize: 24, margin: '0 2px' }}>{w === 5 ? '🟫' : '🟦'}</span>
      ))}
      <span style={{ fontSize: 16, marginLeft: 4 }}>({value})</span>
    </span>
  );
}

function EquationGame({ onBack }) {
  const [eq, setEq] = useState(generateEquation());
  const [step, setStep] = useState(1);
  const [leftWeights, setLeftWeights] = useState(eq.m);
  const [rightWeights, setRightWeights] = useState(eq.z);
  const [removedRight, setRemovedRight] = useState(0);
  const [guess, setGuess] = useState('');
  const [guessError, setGuessError] = useState('');
  const [z1, setZ1] = useState('');
  const [z1Error, setZ1Error] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 1: Remove all weights from left
  const handleRemoveLeft = () => {
    setLeftWeights(0);
    setRightWeights(eq.z);
    setStep(2);
  };

  // Step 2: Remove weights from right to match removed left
  const handleRemoveRight = (amount) => {
    let newRemoved = removedRight + amount;
    if (newRemoved < 0) newRemoved = 0;
    if (newRemoved > eq.m) newRemoved = eq.m;
    setRemovedRight(newRemoved);
    setRightWeights(eq.z - newRemoved);
    if (newRemoved === eq.m) setStep(3);
  };

  // Step 3: Guess x
  const handleGuess = (e) => {
    e.preventDefault();
    const val = parseInt(guess, 10);
    if (isNaN(val) || val < 1 || val > 9) {
      setGuessError('Введите число от 1 до 9');
      return;
    }
    setGuessError('');
    setStep(4);
  };

  // Step 4: Guess k*y
  const handleZ1 = (e) => {
    e.preventDefault();
    const y = parseInt(guess, 10);
    const z1val = parseInt(z1, 10);
    if (isNaN(z1val)) {
      setZ1Error('Введите число');
      return;
    }
    if (z1val !== eq.k * y) {
      setZ1Error('Неверно, попробуйте ещё раз');
      return;
    }
    if (z1val === eq.k * y && y === eq.x && z1val === eq.z - eq.m) {
      setSuccess(true);
      setStep(5);
    } else if (z1val === eq.k * y && y !== eq.x) {
      setZ1Error('Неверное значение x, попробуйте ещё раз');
      setStep(3);
    } else {
      setZ1Error('Неверно, попробуйте ещё раз');
    }
  };

  // Step 5: Success
  const handleRestart = () => {
    const newEq = generateEquation();
    setEq(newEq);
    setStep(1);
    setLeftWeights(newEq.m);
    setRightWeights(newEq.z);
    setRemovedRight(0);
    setGuess('');
    setGuessError('');
    setZ1('');
    setZ1Error('');
    setSuccess(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button onClick={onBack}>Назад</button>
      <h2>Игра: Балансировка уравнения</h2>
      <div style={{ margin: '16px 0', fontSize: 24 }}>
        {[...Array(eq.k)].map((_, i) => <Ball key={i} />)}
        {' + '}
        <Weights value={eq.m} />
        {' = '}
        <Weights value={eq.z} />
      </div>
      <div style={{ fontSize: 20, marginBottom: 16 }}>
        {[...Array(eq.k)].map((_, i) => <span key={i}><Ball /></span>)}
        {' + '}
        <span>{eq.m}</span>
        {' = '}
        <span>{eq.z}</span>
        <br />
        <span style={{ fontWeight: 'bold' }}>x = ?</span>
      </div>
      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h3>Шаг 1: Уберите все гири с левой чаши весов</h3>
          <div style={{ margin: '16px 0' }}>
            <span>Лево: {[...Array(eq.k)].map((_, i) => <Ball key={i} />)} + <Weights value={leftWeights} /></span>
            <span style={{ margin: '0 16px' }}>|</span>
            <span>Право: <Weights value={rightWeights} /></span>
          </div>
          <button onClick={handleRemoveLeft}>Убрать все гири слева</button>
        </div>
      )}
      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h3>Шаг 2: Уберите гири с правой чаши, чтобы сбалансировать весы</h3>
          <div style={{ margin: '16px 0' }}>
            <span>Лево: {[...Array(eq.k)].map((_, i) => <Ball key={i} />)}</span>
            <span style={{ margin: '0 16px' }}>|</span>
            <span>Право: <Weights value={rightWeights} /></span>
          </div>
          <div>
            <button onClick={() => handleRemoveRight(1)} disabled={removedRight >= eq.m}>Убрать 1</button>
            <button onClick={() => handleRemoveRight(5)} disabled={removedRight > eq.m - 5}>Убрать 5</button>
            <button onClick={() => handleRemoveRight(-1)} disabled={removedRight <= 0}>Вернуть 1</button>
            <button onClick={() => handleRemoveRight(-5)} disabled={removedRight < 5}>Вернуть 5</button>
          </div>
          <div style={{ marginTop: 8 }}>Убрано: {removedRight} / {eq.m}</div>
        </div>
      )}
      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h3>Шаг 3: Сколько весит один мяч?</h3>
          <form onSubmit={handleGuess}>
            <input
              type="number"
              min={1}
              max={9}
              value={guess}
              onChange={e => setGuess(e.target.value)}
              style={{ fontSize: 18 }}
            />
            <button type="submit">Ответить</button>
          </form>
          {guessError && <div style={{ color: 'red' }}>{guessError}</div>}
        </div>
      )}
      {/* Step 4 */}
      {step === 4 && (
        <div>
          <h3>Шаг 4: Проверка: {Array(eq.k).fill('y').join(' + ')} = ?</h3>
          <form onSubmit={handleZ1}>
            <input
              type="number"
              value={z1}
              onChange={e => setZ1(e.target.value)}
              style={{ fontSize: 18 }}
            />
            <button type="submit">Проверить</button>
          </form>
          {z1Error && <div style={{ color: 'red' }}>{z1Error}</div>}
        </div>
      )}
      {/* Step 5 */}
      {step === 5 && success && (
        <div>
          <h3>Ура, вы правильно решили уравнение! x = {eq.x}</h3>
          <button onClick={handleRestart}>Сыграть ещё раз</button>
        </div>
      )}
    </div>
  );
}

export default EquationGame;

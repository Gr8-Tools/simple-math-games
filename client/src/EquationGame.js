import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScaleSVG from './ScaleSVG';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation() {
  // x: 1-9, k: 2-5, m: 3-7, z = k*x + m
  const x = getRandomInt(1, 9);
  const k = getRandomInt(2, 5);
  const m = getRandomInt(3, 7);
  const z = k * x + m;
  // For new logic:
  // Left: one weight (value = m)
  // Right: 2-4 weights, one of which is m, the rest sum to z-m
  const rightCount = getRandomInt(2, 4);
  // Always include m as one of the weights
  let otherSum = z - m;
  let otherWeights = [];
  for (let i = 0; i < rightCount - 1; i++) {
    // Distribute otherSum randomly, but each weight at least 1
    let maxVal = otherSum - (rightCount - 2 - i);
    let val = i === rightCount - 2 ? otherSum : getRandomInt(1, Math.max(1, maxVal));
    otherWeights.push(val);
    otherSum -= val;
  }
  // Shuffle right weights
  let rightWeightsArr = [...otherWeights, m];
  for (let i = rightWeightsArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightWeightsArr[i], rightWeightsArr[j]] = [rightWeightsArr[j], rightWeightsArr[i]];
  }
  return { x, k, m, z, rightWeightsArr };
}

function Ball() {
  return <span style={{ fontSize: 32, margin: '0 4px' }}>⚽️</span>;
}

function WeightIcon({ value }) {
  // SVG dumbbell/weight with value label
  return (
    <svg width="38" height="32" style={{ verticalAlign: 'middle', margin: '0 2px' }}>
      <ellipse cx="19" cy="20" rx="16" ry="10" fill="#444" stroke="#222" strokeWidth="2" />
      <rect x="10" y="8" width="18" height="8" rx="3" fill="#888" stroke="#444" strokeWidth="1.5" />
      <text x="19" y="23" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fff">{value}</text>
    </svg>
  );
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
        <WeightIcon key={i} value={w} />
      ))}
      <span style={{ fontSize: 16, marginLeft: 4, color: '#888' }}>({value})</span>
    </span>
  );
}

function EquationGame({ onBack }) {
  const [eq, setEq] = useState(generateEquation());
  const [step, setStep] = useState(1);
  // Left always has one weight (m) and k balls
  const [leftWeight, setLeftWeight] = useState(eq.m);
  const [leftBalls, setLeftBalls] = useState(eq.k); // balls on left
  // Right has array of weights
  const [rightWeights, setRightWeights] = useState(eq.rightWeightsArr);
  const [removedRight, setRemovedRight] = useState([]); // indices of removed weights
  const [removedLeft, setRemovedLeft] = useState(false); // is left weight removed
  const [guess, setGuess] = useState('');
  const [guessError, setGuessError] = useState('');
  const [z1, setZ1] = useState('');
  const [z1Error, setZ1Error] = useState('');
  const [success, setSuccess] = useState(false);

  // Animation: calculate angle based on weight difference
  const leftTotal = (removedLeft ? 0 : leftWeight) + leftBalls * eq.x;
  const rightTotal = rightWeights.reduce((sum, w, i) => removedRight.includes(i) ? sum : sum + w, 0);
  // Angle: max tilt is 20deg, 0 is balanced
  let angle = 0;
  if (leftTotal !== rightTotal) {
    const diff = rightTotal - leftTotal;
    angle = Math.max(-20, Math.min(20, diff * 2));
  }

  // Step 1: Remove the weight from the left
  const handleRemoveLeft = () => {
    setRemovedLeft(true);
    setStep(2);
  };
  // Step 2: Remove weights from right to match left
  const handleRemoveRight = (idx) => {
    if (removedRight.includes(idx)) return;
    setRemovedRight([...removedRight, idx]);
    // If the removed weight matches eq.m, go to next step
    if (rightWeights[idx] === eq.m) setStep(3);
  };
  // Step 2: Return weight to right
  const handleReturnRight = (idx) => {
    setRemovedRight(removedRight.filter(i => i !== idx));
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
    setLeftWeight(newEq.m);
    setLeftBalls(newEq.k);
    setRightWeights(newEq.rightWeightsArr);
    setRemovedRight([]);
    setRemovedLeft(false);
    setGuess('');
    setGuessError('');
    setZ1('');
    setZ1Error('');
    setSuccess(false);
  };

  return (
    <div className="card">
      <button onClick={onBack}>Назад</button>
      <h2>Игра: Балансировка уравнения</h2>
      <div style={{ margin: '16px 0', fontSize: 24, textAlign: 'center' }}>
        {[...Array(eq.k)].map((_, i) => <Ball key={i} />)}
        {' + '}
        <WeightIcon value={eq.m} />
        {' = '}
        {rightWeights.map((w, i) => <WeightIcon key={i} value={w} />)}
      </div>
      <div style={{ fontSize: 20, marginBottom: 16, textAlign: 'center' }}>
        {[...Array(eq.k)].map((_, i) => <span key={i}><Ball /></span>)}
        {' + '}
        <span>{eq.m}</span>
        {' = '}
        <span>{eq.z}</span>
        <br />
        <span style={{ fontWeight: 'bold' }}>x = ?</span>
      </div>
      {/* Animated Scales */}
      <div className="scale-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Removed left weight (drawn near left) */}
        <div style={{ width: 80, minHeight: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {removedLeft && <WeightIcon value={eq.m} />}
        </div>
        <motion.div animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 80 }}>
          <ScaleSVG angle={angle}>
            {/* Left bowl: balls centered, weight centered under balls (even higher) */}
            <g>
              {/* Balls centered horizontally at y=0 */}
              {[...Array(leftBalls)].map((_, i) =>
                <text key={i} x={-((leftBalls-1)*18) + i*36} y={-6} fontSize="32" textAnchor="middle">⚽️</text>
              )}
              {/* Weight centered under balls, y=8 (higher than before) */}
              {!removedLeft && <g transform="translate(0,8)"><WeightIcon value={leftWeight} /></g>}
            </g>
            {/* Right bowl: all weights that are not removed, centered horizontally */}
            <g>
              {(() => {
                const activeWeights = rightWeights.filter((_, i) => !removedRight.includes(i));
                return activeWeights.map((w, i) =>
                  <g key={i} transform={`translate(${-((activeWeights.length-1)*20) + i*40},0)`}><WeightIcon value={w} /></g>
                );
              })()}
            </g>
          </ScaleSVG>
        </motion.div>
        {/* Removed right weights (drawn near right) */}
        <div style={{ width: 160, minHeight: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {removedRight.map(idx => <WeightIcon key={idx} value={rightWeights[idx]} />)}
        </div>
      </div>
      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h3>Шаг 1: Уберите гирю с левой чаши весов</h3>
          <button onClick={handleRemoveLeft} disabled={removedLeft}>Убрать гирю слева</button>
        </div>
      )}
      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h3>Шаг 2: Уберите гирю с правой чаши, равную по весу левой</h3>
          <div>
            {rightWeights.map((w, i) =>
              !removedRight.includes(i)
                ? <button key={i} onClick={() => handleRemoveRight(i)}>{w}</button>
                : <button key={i} onClick={() => handleReturnRight(i)} style={{ background: '#eee', color: '#888' }}>Вернуть {w}</button>
            )}
          </div>
        </div>
      )}
      {/* Step 3+ (rest of game as before) */}
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
          {guessError && <div className="error">{guessError}</div>}
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
          {z1Error && <div className="error">{z1Error}</div>}
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

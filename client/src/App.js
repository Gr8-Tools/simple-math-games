import React, { useState } from 'react';
import EquationGame from './EquationGame';

function App() {
  const [game, setGame] = useState(null);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Простые математические игры</h1>
      {!game && (
        <div>
          <h2>Выберите игру</h2>
          <button onClick={() => setGame('equation')}>Балансировка уравнения</button>
        </div>
      )}
      {game === 'equation' && <EquationGame onBack={() => setGame(null)} />}
    </div>
  );
}

export default App;

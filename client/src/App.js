import React, { useState } from 'react';
import EquationGame from './EquationGame';

function App() {
  const [game, setGame] = useState(null);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Простые математические игры</h1>
        {!game && (
          <div>
            <h2>Выберите игру</h2>
            <button onClick={() => setGame('equation')}>Балансировка уравнения</button>
          </div>
        )}
        {game === 'equation' && <EquationGame onBack={() => setGame(null)} />}
      </div>
    </div>
  );
}

export default App;

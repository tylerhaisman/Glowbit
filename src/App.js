import './App.css';
import Gameboard from './Gameboard';
import React, { useState } from "react";

function App() {

  const [level, setLevel] = useState(1);

  const resetGame = () => {
    setLevel(level => level + 1);
  };

  return (
    <div className="App">
      <div className="page">
        <header>
        <div className="content">
          <div className="title">
            <h1>GLOWBIT</h1>
          </div>
          <div className="options">
            <button class="howtoplay">How To Play</button>
          </div>
        </div>
        </header>
        <section className="play">
          <div className="content">
            <Gameboard level={level} resetGame={resetGame}></Gameboard>
          </div>
        </section>
        <footer>
          <p>© 2023 <a href='https://tylerhaisman.com'>Tyler Haisman</a></p>
          <button class="about">About The Game</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';

import Cell from './Cell';

// function getRandomValue() {
//   let max = 36;
//   let min = 1;
//   return Math.floor(Math.random() * (max - min) + min);
// }

let previousRow = -1;
let previousCol = -1;
var start = 0;
var totalTime = 0;

let count = 0;

const Gameboard = (props) => {

  let gameOver = false;
  let win = false;

  let currentLevel = props.level;

  let r = currentLevel + 1;
  let c = currentLevel + 1;

  function getRandomValue() {
    let max = r * c;
    let min = 1;
    return Math.floor(Math.random() * (max - min) + min);
  }

  const [driver, setDriver] = useState(() => {
    const newDriver = [];
    for (let i = 0; i < r; i++) {
      newDriver[i] = [];
      for (let j = 0; j < c; j++) {
        newDriver[i][j] = { isClicked: false, value: getRandomValue() };
      }
    }
    return newDriver;
  });

  const memoizationTable = [];
  for (let i = 0; i < r; i++) {
    const rowCells = [];
    for (let j = 0; j < c; j++) {
      rowCells.push(driver[i][j].value);
    }
    memoizationTable.push(rowCells);
  }

  let numRows = memoizationTable.length;
  let numCols = memoizationTable[0].length;

    memoizationTable[0][0] = driver[0][0].value;
  for (let row = 1; row < numRows; row++) {
    memoizationTable[row][0] = memoizationTable[row - 1][0] + driver[row][0].value;
  }
  for (let col = 1; col < numCols; col++) {
    memoizationTable[0][col] = memoizationTable[0][col - 1] + driver[0][col].value;
  }
  for (let row = 1; row < numRows; row++) {
    for (let col = 1; col < numCols; col++) {
      let val = 0;
      if (memoizationTable[row - 1][col] > memoizationTable[row][col - 1]) {
        val = memoizationTable[row - 1][col];
      } else {
        val = memoizationTable[row][col - 1];
      }
      memoizationTable[row][col] = val + driver[row][col].value;
    }
  }

  let targetSum = memoizationTable[numRows - 1][numCols - 1];

  const handleClick = (row, col) => {
    if(!gameOver){
      if((row - 1 == previousRow && col == previousCol) || (row == previousRow && col - 1 == previousCol) || ((row == 0 && col == 0) && driver[row][col].isClicked == false)){
        setDriver(prevDriver => {
          count++;
          if(count == 1){
            start = new Date().getTime();
          }
          const newDriver = [...prevDriver];
          newDriver[row][col].isClicked = !newDriver[row][col].isClicked;
          previousRow = row;
          previousCol = col;
          return newDriver;
        });
      }
    }
  };

  let currentSum = 0;

  const gameboardRows = [];
  for (let i = 0; i < r; i++) {
    const rowCells = [];
    for (let j = 0; j < c; j++) {
      if(driver[i][j].isClicked){
        currentSum += driver[i][j].value;
      }
      if(driver[r - 1][c - 1].isClicked && currentSum == targetSum){
        gameOver = true;
        win = true;
        var end = new Date().getTime();
        var time = end - start;
        totalTime = (time/1000).toFixed(2);
        document.getElementById("time").textContent = "Your Time: " + totalTime + "s";
        document.getElementById("gameover").textContent = "Game Over";
        document.getElementById("aftergame").style.visibility = "visible";
        document.getElementById("winstatus").textContent = "You Won!";
        document.getElementById("winstatus").style.textShadow = "0 0 40px #1aff00";
        document.getElementById("winstatus").style.color = "#1aff00";
        document.getElementById("endbtn").textContent = "Next Level";
        // var button = document.createElement("button");
        // button.innerHTML = "Next Level";
        // var buttons = document.getElementById("buttons");
        // buttons.appendChild(button);
        // button.addEventListener ("click", function() {
        //   handleReset();
        // });
      }
      if(driver[r - 1][c - 1].isClicked && currentSum != targetSum){
        gameOver = true;
        win = false;
        var end = new Date().getTime();
        var time = end - start;
        totalTime = (time/1000).toFixed(2);
        document.getElementById("time").textContent = "Your Time: " + totalTime + "s";
        document.getElementById("gameover").textContent = "Game Over";
        document.getElementById("aftergame").style.visibility = "visible";
        document.getElementById("winstatus").textContent = "You Lost";
        document.getElementById("winstatus").style.textShadow = "0 0 40px #ff0000";
        document.getElementById("winstatus").style.color = "#ff0000";
        document.getElementById("endbtn").textContent = "Play Again";
        // var button = document.createElement("button");
        // button.innerHTML = "Play Again";
        // var buttons = document.getElementById("buttons");
        // buttons.appendChild(button);
        // button.addEventListener ("click", function() {
        //   handleRefresh();
        // });
      }
      rowCells.push(
        <Cell
          key={`${i}-${j}`}
          value={driver[i][j].value}
          isClicked={driver[i][j].isClicked}
          onClick={() => handleClick(i, j)}
          isGameOver={gameOver}
          winStatus={win}
        />
      );
    }
    gameboardRows.push(<tr key={i}>{rowCells}</tr>);
  }

  const handleReset = () => {
    if(!win){
      window.location.reload();
    }
    else{
      props.resetGame();

      previousRow = -1;
      previousCol = -1;
      start = 0;
      totalTime = 0;
      count = 0;
      currentSum = 0;
  
      gameOver = false;
      win = false;
  
      setDriver(prevDriver => {
  
        currentLevel++;
  
        r = currentLevel + 1;
        c = currentLevel + 1;
  
        const newDriver = [];
      for (let i = 0; i < r; i++) {
        newDriver[i] = [];
        for (let j = 0; j < c; j++) {
          newDriver[i][j] = { isClicked: false, value: getRandomValue() };
        }
      }
      return newDriver;
      });
      // additional reset logic goes here
  
      document.getElementById("aftergame").style.visibility = "hidden";
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
          <div className="gameboard">
      <table>
        <tbody>{gameboardRows}</tbody>
      </table>
      <div id="aftergame" className="gameover">
            <h1 id="gameover"></h1>
            <h2 id="winstatus"></h2>
            <div className="runtime">
            <p id="time"></p>
          </div>
          <div id="buttons" className="buttons">
            {/* <button onClick={handleRefresh} id="endbtn">Play Again</button> */}
            <button onClick={handleReset} id="endbtn">Next Level</button>
            {/* <button>Next Level</button> */}
          </div>
          </div>
    </div>
  );
};

export default Gameboard;
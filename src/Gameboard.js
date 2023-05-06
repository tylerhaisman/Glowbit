import { useState } from 'react';

import Cell from './Cell';

//initializing table values
let previousRow = -1;
let previousCol = -1;

//initializing time-tracking values
var start = 0;
var totalTime = 0;

//initializing count of successful clicks
let count = 0;

const Gameboard = (props) => {

  //initializing game tracking values
  let gameOver = false;
  let win = false;

  //initializing level value using the level prop passed into "Gameboard"
  let currentLevel = props.level;

  //initializing number of rows and columns which will each be 1 greater than the current level
  let r = currentLevel + 1;
  let c = currentLevel + 1;

  //initializing the random number generator
  function getRandomValue() {
    let max = r * c;
    let min = 1;
    return Math.floor(Math.random() * (max - min) + min);
  }

  //initializing the gameboard 2D array
  const [driver, setDriver] = useState(() => {
    const newDriver = [];
    for (let i = 0; i < r; i++) {
      newDriver[i] = [];
      for (let j = 0; j < c; j++) {
        //essentially the array holds a JavaScript object with three key-value pairs
        newDriver[i][j] = { isClicked: false, value: getRandomValue(), canBe: false };
      }
    }
    //setting that the first node in the upper left can be clicked
    newDriver[0][0].canBe = true;
    return newDriver;
  });

  //initializing memoization table for solution computation
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

  //calculating the global solution using the values from the memoization table
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

  //target sum == the number in the lower right-hand corner of the memoization table
  let targetSum = memoizationTable[numRows - 1][numCols - 1];

  //function that runs every time a user clicks on a table cell
  const handleClick = (row, col) => {
    if(!gameOver){
      //checking to see if the cell "can" be clicked (must be to the immediate right of the previous cell or immediately beneath)
      if((row - 1 == previousRow && col == previousCol) || (row == previousRow && col - 1 == previousCol) || ((row == 0 && col == 0) && driver[row][col].isClicked == false)){
        setDriver(prevDriver => {
          count++;
          if(count == 1){
            //running stopwatch to track execution time
            start = new Date().getTime();
          }
          const newDriver = [...prevDriver];

          //setting the cell that was clicked to true
          newDriver[row][col].isClicked = !newDriver[row][col].isClicked;

          //checking to see if the next cells that can be clicked are in bounds
          if(row + 1 < newDriver.length){
            //setting can be clicked to true
            newDriver[row + 1][col].canBe = true;
          }
          if(col + 1 < newDriver.length){
            //setting can be clicked to true
            newDriver[row][col + 1].canBe = true;
          }
          //updating the current cell so it can no longer be "clicked" as well as the other cell that may have been set to true
          newDriver[row][col].canBe = false;
          if((row - 1 >= 0) && (col + 1 < newDriver[0].length)){
            newDriver[row - 1][col + 1].canBe = false;
          }
          if((col - 1 >= 0) && (row + 1 < newDriver.length)){
            newDriver[row + 1][col - 1].canBe = false;
          }

          //updating previousRow and previousCol
          previousRow = row;
          previousCol = col;

          return newDriver;
        });
      }
    }
  };

  //summing the currently isClicked nodes
  let currentSum = 0;
  const gameboardRows = [];
  for (let i = 0; i < r; i++) {
    const rowCells = [];
    for (let j = 0; j < c; j++) {
      if(driver[i][j].isClicked){
        currentSum += driver[i][j].value;
      }
      //if the sum of all clicked nodes is equal to the target sum and the game is over, player wins
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
      }
      //if the sum of all clicked nodes is not equal to the target sum and the game is over, player loses
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
      }
      //pushing all cells to the row
      rowCells.push(
        <Cell
          key={`${i}-${j}`}
          value={driver[i][j].value}
          isClicked={driver[i][j].isClicked}
          onClick={() => handleClick(i, j)}
          isGameOver={gameOver}
          winStatus={win}
          canBeClicked={driver[i][j].canBe}
        />
      );
    }
    //pushing all rows to the gameboard
    gameboardRows.push(<tr key={i}>{rowCells}</tr>);
  }

  //resetting the gameboard after the user clicks a button ("Next Level" or "Play Again")
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
      newDriver[0][0].canBe = true;
      return newDriver;
      });  
      document.getElementById("aftergame").style.visibility = "hidden";
    }
  };

  // const handleRefresh = () => {
  //   window.location.reload();
  // };

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
            <button onClick={handleReset} id="endbtn">Next Level</button>
          </div>
          </div>
    </div>
  );
};

export default Gameboard;
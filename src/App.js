import {useState, useEffect} from 'react';
import Field from './components/Field';
import { Patterns } from './Patterns';

function App() {
  let resultText = "";
  const [board, setBoard] = useState(["","","","","","","","",""]);
  const [player, setPlayer] = useState("X");
  const [result, setResult] = useState({winner: "none", state: "none" });

  useEffect(() => {
    checkDraw();
    checkWin();
  }, [board]);

  useEffect(() => {
    if (result.state == "Tie"){
      document.getElementById('resultText').innerHTML = "Koniec Gry! Remis!";
      document.getElementById('resetGame').style.display = "block";
    }
    if (result.state !== "none" && result.state !== "Tie") {
      document.getElementById('resultText').innerHTML = "Koniec Gry! Zwyciężył: "+ result.winner +"!";
      document.getElementById('resetGame').style.display = "block";
    }
  }, [result]);

  const chooseField = (field) => {
    let testVal = "";
    if (result.state != "won"){
      setBoard(
        board.map((val, index) => {
          if (index == field && val == "") {
            return player;
          }
          return val;
        })
      );
      
      board.map((val, index) => {
        if (index == field) {
          testVal = val;
        }
      });

      if (testVal == ""){
        if (player == "X") {
          setPlayer("O");
        } else {
          setPlayer("X");
        }
      }
    }
  };

  const checkWin = () => {
    Patterns.forEach((currPattern) => {
        const firstPlayer = board[currPattern[0]];
        if (firstPlayer == "") return;
        let foundWinningPattern = true;

        currPattern.forEach((index) => {
          if (board[index] != firstPlayer){
              foundWinningPattern = false;
          }
        });

        if (foundWinningPattern) {
            setResult({winner: firstPlayer, state: "won"});
            currPattern.forEach((index) => {
              if (board[index] == firstPlayer){
                  board[index] = <span>{board[index]}</span>;
              }
            });
        }
    });
  }

  const checkDraw = () => {
    let filled = true;
    board.forEach((field) => {
      if (field == "") {
        filled = false;
      }
    })

    if (filled && result.state != "won") {
      setResult ({winner: "N.A.", state: "Tie"});
    }
  }

  const restartGame = () => {
    setBoard(["","","","","","","","",""]);
    setPlayer("X");
    setResult ({winner: "none", state: "none"});
    document.getElementById('resultText').innerHTML = "";
    document.getElementById('resetGame').style.display = "none";
  }
  
  return (
    <div className="container">
        <div className="header">
            <h2>KÓŁKO I KRZYŻYK</h2>
        </div>
        <div className="main">
            <div className="row">
                <Field val={board[0]} chooseField={() => chooseField(0)}/>
                <Field val={board[1]} chooseField={() => chooseField(1)}/>
                <Field val={board[2]} chooseField={() => chooseField(2)}/>
            </div>
            <div className="row">
                <Field val={board[3]} chooseField={() => chooseField(3)}/>
                <Field val={board[4]} chooseField={() => chooseField(4)}/>
                <Field val={board[5]} chooseField={() => chooseField(5)}/>
            </div>
            <div className="row">
                <Field val={board[6]} chooseField={() => chooseField(6)}/>
                <Field val={board[7]} chooseField={() => chooseField(7)}/>
                <Field val={board[8]} chooseField={() => chooseField(8)}/>
            </div>
        </div>
        <h2 id="resultText"></h2>
        <button id="resetGame" onClick={restartGame}>NOWA GRA</button>
    </div>
  );
}

//Jeśli to czytasz to zrob sobie przerwe od programowania pls dla wlasnego zdrowia
//https://www.youtube.com/watch?v=Ta2CK4ByGsw

export default App;

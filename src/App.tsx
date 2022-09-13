import React, { Fragment, useEffect, useRef, useState } from "react";
import { Board } from "./models/Board";
import BoardComponent from "./components/BoardComponent";
import "./styles/app.css";
import { Player } from "./models/Player";
import { Colors } from "./models/Colors";
import LostFiguresComponent from "./components/LostFiguresComponent";
import TimerComponent from "./components/TimerComponent";
import StartScreenComponent from "./components/StartScreenComponent";

function App() {
  const [startScreenOpen, setStartScreenOpen] = useState<boolean>(true);

  const [board, setBoard] = useState(new Board());
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);

  useEffect(() => {
    restart();
    setCurrentPlayer(whitePlayer);
  }, []);

  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
  }

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }
  useEffect(() => {
   // setBoardMoves([...boardMoves, board.getDeepCopyBoard()]);
   
  }, [currentPlayer]);

  return (
    <div className="app">
      {startScreenOpen && (
        <StartScreenComponent setStartScreenOpen={setStartScreenOpen} />
      )}
      {!startScreenOpen && (
        <Fragment>
          <TimerComponent currentPlayer={currentPlayer} restart={restart} />
          <BoardComponent
            currentPlayer={currentPlayer}
            swapPlayer={swapPlayer}
            setBoard={setBoard}
            board={board}
            setCurrentPlayer={setCurrentPlayer}
            restart={restart}
          />
          <div className="lostfigures-table">
            <LostFiguresComponent
              title="Black Figures"
              figures={board.lostBlackFigures && board.lostBlackFigures}
            />
            <LostFiguresComponent
              title="White Figures"
              figures={board.lostWhiteFigures}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default App;

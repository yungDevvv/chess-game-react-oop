import React, { FC, useEffect, useRef, useState } from "react";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import King from "../models/figures/King";
import { Player } from "../models/Player";
import CellComponent from "./CellComponent";

interface BoardComponentProps {
  board: Board;
  setBoard: (board: Board) => void;
  setCurrentPlayer: (player: Player) => void;
  swapPlayer: () => void;
  currentPlayer: Player;
  restart: () => void;
}

const BoardComponent: FC<BoardComponentProps> = ({
  currentPlayer,
  swapPlayer,
  board,
  setBoard,
  setCurrentPlayer,
  restart
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [count, setCount] = useState(0);
  const boardMoves: any = useRef([]);

  const prevSelectedCells: any = useRef([]);

  function click(cell: Cell) {
    if (
      selectedCell &&
      cell !== selectedCell &&
      selectedCell.figure?.canMove(cell)
    ) {
      if(cell.figure?.name === FigureNames.KING) {
        alert('Game is over!')
        restart();
      }
      if (selectedCell.figure.name === FigureNames.KING) {
        if (board.getCell(cell.x, cell.y).isDangerousForKing === true) {
          if (board.getCell(cell.x, cell.y).isDoubleDangerousForKing !== true && selectedCell.isEnemy(board.getCell(cell.x, cell.y))) {
           /* These conditions help fix a bug where the King can eat an enemy piece, but the King is then eaten by another enemy figure. */
            prevSelectedCells.current.push(selectedCell);
            boardMoves.current.push(board.getDeepCopyBoard());
            selectedCell.moveFigure(cell);
            swapPlayer();
            setSelectedCell(null);
  
          } else {
            alert("You can't come here!");
          }
        } else {
          prevSelectedCells.current.push(selectedCell);// This fixes the visual, more below in "prevStep" function
          boardMoves.current.push(board.getDeepCopyBoard()); 
          
          selectedCell.moveFigure(cell);
          swapPlayer();
          setSelectedCell(null);
        }
      } else {
        prevSelectedCells.current.push(selectedCell); // This fixes the visual, more below in "prevStep" function
        boardMoves.current.push(board.getDeepCopyBoard());
        
        selectedCell.moveFigure(cell);
        swapPlayer();
        setSelectedCell(null);
      }
    } else {
      if (cell.figure?.color === currentPlayer.color) {
        setSelectedCell(cell);
      }
    }
  }
  
  function highlightCells() {
    board.highligthCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }
  function prevStep(currentPlayer: Player) {
    if (boardMoves.current.length > 1) {
      if (currentPlayer.color === Colors.BLACK) {
        setCurrentPlayer(new Player(Colors.WHITE));
      } else {
        setCurrentPlayer(new Player(Colors.BLACK));
      }
      setBoard(boardMoves.current[boardMoves.current.length - 1]);
      boardMoves.current.pop();
      // I didn’t find the right solution to this problem, except to make a visual a little bit different
      // Otherwise, if not the code below, then when the figure returns a move back, it has green circles around it, but you can’t move on them, because there is no selected cell
      setSelectedCell(
        prevSelectedCells.current[prevSelectedCells.current.length - 1]
      );
      prevSelectedCells.current.pop();
    }
  }
  useEffect(() => {
    /* Check Logic */ 
    for (let i = 0; i < board.cells.length; i++) {
      const row = board.cells[i];
      for (let k = 0; k < row.length; k++) {
        // searching for enemy figures
        const target = row[k];
        if (
          currentPlayer.color === Colors.WHITE &&
          target.figure?.color === Colors.BLACK
        ) {
          board.highligthCells(target);
        } else if (
          currentPlayer.color === Colors.BLACK &&
          target.figure?.color === Colors.WHITE
        ) {
          board.highligthCells(target);
        }
      }
    }
  }, [currentPlayer]);

  useEffect(() => {
    /* Checking for potentially lost King moves, they are highlighted with a red circle. */
    if (selectedCell?.figure?.name === FigureNames.KING) {
      for (let i = 0; i < board.cells.length; i++) {
        const row = board.cells[i];
        for (let k = 0; k < row.length; k++) {
          // searching for enemy figures
          const target = row[k];
          if (
            currentPlayer.color === Colors.WHITE &&
            target.figure?.color === Colors.BLACK
          ) {
            board.checkKing(target);
          } else if (
            currentPlayer.color === Colors.BLACK &&
            target.figure?.color === Colors.WHITE
          ) {
            board.checkKing(target);
          }
        }
      }
      board.initDangerousCells();
    } else {
      board.clearKingDangerousCells();
    }
    highlightCells();
  }, [selectedCell]);

  return (
    <div className="board">
      <div className="board-title">
        <h4 style={{ display: "inline-block" }}>
          Current player: {currentPlayer.color.toUpperCase()}
        </h4>
        <button className='prev-button' onClick={() => prevStep(currentPlayer)}>Move Backward</button>
      </div>
      {board.cells.map(row =>
        row.map((cell, i) => (
          <CellComponent
            click={click}
            key={cell.id}
            cell={cell}
            selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
          />
        ))
      )}
    </div>
  );
};

export default BoardComponent;

import { Cell } from "./Cell";
import { Colors } from "./Colors";
import Queen from "../models/figures/Queen"
import Pawn from "../models/figures/Pawn"
import King from "../models/figures/King"
import Bishop from "../models/figures/Bishop"
import Rook from "../models/figures/Rook"
import Knight from "../models/figures/Knight"
import { Figure, FigureNames } from "./Figure";
import { Player } from "./Player";
import _ from "lodash";


export class Board {
   cells: Cell[][] = [];
   lostWhiteFigures: Figure[] = [];
   lostBlackFigures: Figure[] = [];
   kingUnderAttack: Figure[] = [];
   kingAttackCells: Cell[] = []; // all cells that figures can move
   public initCells() {
      for (let i = 0; i < 8; i++) {
         const row: Cell[] = [];
         for (let k = 0; k < 8; k++) {
            if ((i + k) % 2 !== 0) {
               row.push(new Cell(this, k, i, Colors.BLACK, null)); // black cells
            } else {
               row.push(new Cell(this, k, i, Colors.WHITE, null)); // white cells
            }
         };
         this.cells.push(row);
      };
   }
   public kingIsUnderAttack() {
      return this.kingUnderAttack
   }
   public highligthCells(selectedCell: Cell | null) {
      for (let i = 0; i < this.cells.length; i++) {
         const row = this.cells[i]
         for (let k = 0; k < row.length; k++) {
            const target = row[k];
            target.available = !!selectedCell?.figure?.canMove(target)
            if (target.figure?.name === FigureNames.KING && target.available) {
               alert(`${target.figure.color.toLocaleUpperCase()} check`)
            }
         };
      };
   }

   public checkKing(cell: Cell) { // cells with figures we check them ходы
      for (let i = 0; i < this.cells.length; i++) {
         const row = this.cells[i]
         for (let k = 0; k < row.length; k++) {
            const target = row[k];
            if (cell.figure?.canFakeMove(target)) {
               if(cell.isEnemy(target)) {
                  this.kingAttackCells.push(target)
               }
               this.kingAttackCells.push(target)
            }
         };
      };
   }
   public initDangerousCells() {
      for (let i = 0; i < this.kingAttackCells.length; i++) {
         let dangerousCell = this.kingAttackCells[i]
         
         if(this.getCell(dangerousCell.x, dangerousCell.y).isDangerousForKing === true) {
            this.getCell(dangerousCell.x, dangerousCell.y).isDoubleDangerousForKing = true
         } else {
            this.getCell(dangerousCell.x, dangerousCell.y).isDangerousForKing = true
         }
      };
   }
   public clearKingDangerousCells() {
      this.kingAttackCells = [];
      for (let i = 0; i < this.cells.length; i++) {
         const row = this.cells[i]
         for (let k = 0; k < row.length; k++) {
            const target = row[k];
            if (target.isDangerousForKing === true) {
               target.isDangerousForKing = false;
            }
            if(target.isDoubleDangerousForKing === true) {
               target.isDoubleDangerousForKing = false;
            }
         };
      };

   }
   public isKingUnderAttack(currentPlayer: Player) {
      for (let i = 0; i < this.cells.length; i++) {
         const row = this.cells[i]
         for (let k = 0; k < row.length; k++) {
            const target = row[k]
            if (currentPlayer.color === Colors.BLACK && target.figure?.color === Colors.WHITE) {
               this.highligthCells(target)
            } else {
               this.highligthCells(target)
            }
         };
      };

   }
   
   public getCopyBoard(): Board {
      const newBoard = new Board();
      newBoard.cells = this.cells;
      newBoard.lostBlackFigures = this.lostBlackFigures;
      newBoard.lostWhiteFigures = this.lostWhiteFigures;
      newBoard.kingUnderAttack = this.kingUnderAttack;
      newBoard.kingAttackCells = this.kingAttackCells;
      return newBoard;
   }
   public getDeepCopyBoard(): Board {
      const newBoard = new Board();
      newBoard.cells = _.cloneDeep(this.cells);
      newBoard.lostBlackFigures = _.cloneDeep(this.lostBlackFigures);
      newBoard.lostWhiteFigures = _.cloneDeep(this.lostWhiteFigures);
      newBoard.kingUnderAttack = _.cloneDeep(this.kingUnderAttack);
      newBoard.kingAttackCells = _.cloneDeep(this.kingAttackCells);
      return newBoard;
   }
   public getCell(x: number, y: number) {
      return this.cells[y][x]
   }
   private addPawns() {
      for (let i = 0; i < 8; i++) {
        new Pawn(Colors.BLACK, this.getCell(i, 1))
        new Pawn(Colors.WHITE, this.getCell(i, 6))
      }
    }
  
    private addKings() {
      new King(Colors.BLACK, this.getCell(4, 0))
      new King(Colors.WHITE, this.getCell(4, 7))
    }
  
    private addQueens() {
      new Queen(Colors.BLACK, this.getCell(3, 0))
      new Queen(Colors.WHITE, this.getCell(3, 7))
    }
  
    private addBishops() {
      new Bishop(Colors.BLACK, this.getCell(2, 0))
      new Bishop(Colors.BLACK, this.getCell(5, 0))
      new Bishop(Colors.WHITE, this.getCell(2, 7))
      new Bishop(Colors.WHITE, this.getCell(5, 7))
    }
  
    private addKnights() {
      new Knight(Colors.BLACK, this.getCell(1, 0))
      new Knight(Colors.BLACK, this.getCell(6, 0))
      new Knight(Colors.WHITE, this.getCell(1, 7))
      new Knight(Colors.WHITE, this.getCell(6, 7))
    }
  
    private addRooks() {
      new Rook(Colors.BLACK, this.getCell(0, 0))
      new Rook(Colors.BLACK, this.getCell(7, 0))
      new Rook(Colors.WHITE, this.getCell(0, 7))
      new Rook(Colors.WHITE, this.getCell(7, 7))
    }

   public addFigures() {
      this.addKnights()
      this.addPawns()
      this.addQueens()
      this.addRooks()
      this.addBishops()
      this.addKings()
   }
}
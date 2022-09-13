import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./Figure"

 
export class Cell {
   readonly x: number;
   readonly y: number;
   readonly color: Colors;
   figure: Figure | null;
   board: Board;
   available: boolean; // Is cell available
   id: number; // for react keys
   isDangerousForKing: boolean = false;
   isDoubleDangerousForKing: boolean = false;
   constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.figure = figure;
      this.board = board;
      this.available = false;
      this.id = Math.random()
   }

   isEmpty(): boolean {
      return this.figure === null;
   }

   isEnemy(target: Cell): boolean {
      if (target.figure) {
         return this.figure?.color !== target.figure.color;
      }
      return false
   }

   isFakeEmptyVertical(target: Cell): boolean {
      if (this.x !== target.x) return false;


      const min = Math.min(this.y, target.y)
      const max = Math.max(this.y, target.y)

      for (let i = min + 1; i < max; i++) {
         
         if (!this.board.getCell(this.x, i).isEmpty() && this.board.getCell(this.x, i).figure?.name !== FigureNames.KING) {
            // this.board.getCell(this.x, i).figure?.name !== FigureNames.KING
            // is needed that we got red cell then we select King and it shows ways that he can't go
            return false;
         }
      };
      return true
   }
   isEmptyVertical(target: Cell): boolean {
      
      if (this.x !== target.x) return false;


      const min = Math.min(this.y, target.y)
      const max = Math.max(this.y, target.y)

      for (let i = min + 1; i < max; i++) {
         
         if (!this.board.getCell(this.x, i).isEmpty()) {
            // this.board.getCell(this.x, i).figure?.name !== FigureNames.KING
            // is needed that we got red cell then we select King and it shows ways that he can't go
            return false;
         }
      };
      return true
   }
   isFakeEmptyHorizontal(target: Cell): boolean {
      if (this.y !== target.y) return false;

      const min = Math.min(this.x, target.x)
      const max = Math.max(this.x, target.x)

      for (let i = min + 1; i < max; i++) {
         if (!this.board.getCell(i, this.y).isEmpty() && this.board.getCell(i, this.y).figure?.name !== FigureNames.KING) {
            // this.board.getCell(i, this.x).figure?.name !== FigureNames.KING
            // is needed that we got red cell then we select King and it shows ways that he can't go
            return false;
         }
      };
      return true;
   }
   isEmptyHorizontal(target: Cell): boolean {

      if (this.y !== target.y) return false;

      const min = Math.min(this.x, target.x)
      const max = Math.max(this.x, target.x)

      for (let i = min + 1; i < max; i++) {
         if (!this.board.getCell(i, this.y).isEmpty()) {
            // this.board.getCell(i, this.x).figure?.name !== FigureNames.KING
            // is needed that we got red cell then we select King and it shows ways that he can't go
            return false;
         }
      };
      return true;
   }
   
   isFakeEmptyDiagonal(target: Cell): boolean {
      
      const absX = Math.abs(target.x - this.x);
      const absY = Math.abs(target.y - this.y);

      if (absY !== absX) return false;

      const dy = this.y < target.y ? 1 : -1
      const dx = this.x < target.x ? 1 : -1

      for (let i = 1; i < absY; i++) {
         if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty() && this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name !== FigureNames.KING) {
            // this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name !== FigureNames.KING ->
            // is needed that we got red cell then we select King and it shows ways that he can't go
            return false;
         }
      };
      return true;
   }

   isEmptyDiagonal(target: Cell): boolean {
      const absX = Math.abs(target.x - this.x);
      const absY = Math.abs(target.y - this.y);

      if(absY !== absX) return false;
  
      const dy = this.y < target.y ? 1 : -1
      const dx = this.x < target.x ? 1 : -1
  
      for (let i = 1; i < absY; i++) {
        if(!this.board.getCell(this.x + dx*i, this.y + dy   * i).isEmpty())
          return false;
      }
      return true;
      
   }

   setFigure(figure: Figure) {
      this.figure = figure;
      this.figure.cell = this;
   }
   addLostFigure(figure: Figure) {
      this.figure?.color !== Colors.BLACK
         ? this.board.lostBlackFigures.push(figure)
         : this.board.lostWhiteFigures.push(figure)
   }
   moveFigure(target: Cell) {
      if (this.figure && this.figure?.canMove(target)) {
         if (target.figure) {
            this.addLostFigure(target.figure)
         }
         this.figure.moveFigure(target)
         target.setFigure(this.figure);
         this.figure = null;
      }
   }
}
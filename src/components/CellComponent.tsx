import React, { FC } from "react";
import { Cell } from "../models/Cell";

interface CellComponentProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
}

const CellComponent: FC<CellComponentProps> = ({cell, selected, click }) => {
  return (
    <div data-dangerous={cell.isDangerousForKing} data-x={cell.x} data-y={cell.y} onClick={() => click(cell)} className={['cell', cell.color, cell.available && cell.figure ? "available-cell-figure" : '', selected ? "selected" : ""].join(' ')}>
      {cell.available && !cell.figure && <div style={{background: cell.isDangerousForKing ? 'red' : ''}} className={"cursor available"}></div>}
      {cell.figure?.logo && (
        <img className="cursor" src={cell.figure.logo} alt={cell.figure.logo} />
      )}
    </div>
  );
};

export default CellComponent;

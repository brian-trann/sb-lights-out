import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
	const [ board, setBoard ] = useState(createBoard());

	/** create a board nrows high/ncols wide, each cell randomly lit or unlit */
	function createBoard() {
		const initialBoard = Array.from({ length: nrows }, () =>
			Array.from({ length: ncols }, () => Math.random() < chanceLightStartsOn)
		);
		// create array-of-arrays of true/false values -- DONE

		return initialBoard;
	}
	/**
	 * hasWon checks if every cell/light on the board is false or "unlit"
	 * 
	 * Returns true if all lights are off
	 * 
	 * @returns {Boolean} boolean
	 */
	function hasWon() {
		return board.every((row) => row.every((light) => !light));
	}

	function flipCellsAround(coord) {
		setBoard((oldBoard) => {
			const [ y, x ] = coord.split('-').map(Number);

			const flipCell = (y, x, boardCopy) => {
				// if this coord is actually on board, flip it

				if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
					boardCopy[y][x] = !boardCopy[y][x];
				}
			};

			//  Make a (deep) copy of the oldBoard -- DONE
			const newBoard = oldBoard.map((row) => [ ...row ]);

			// in the copy, flip this cell and the cells around it
			flipCell(y, x, newBoard);
			flipCell(y, x - 1, newBoard);
			flipCell(y, x + 1, newBoard);
			flipCell(y + 1, x, newBoard);
			flipCell(y - 1, x, newBoard);

			return newBoard;
		});
	}

	// if the game is won, just show a winning msg & render nothing else
	if (hasWon()) {
		return <div className="Board-win">You have won!</div>;
	}

	// make table board
	const tableBoard = [];
	for (let y = 0; y < nrows; y++) {
		const row = [];
		for (let x = 0; x < ncols; x++) {
			const coord = `${y}-${x}`;
			row.push(<Cell key={coord} isLit={board[y][x]} flipCellsAroundMe={() => flipCellsAround(coord)} />);
		}
		tableBoard.push(<tr key={y}>{row}</tr>);
	}
	return (
		<table className="Board">
			<tbody>{tableBoard}</tbody>
		</table>
	);
}

export default Board;

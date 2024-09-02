"use client";
import React from "react";

function MainComponent() {
  const [gameBoard, setGameBoard] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);

  const GRID_SIZE = 9;
  const NUM_BOMBS = 10;

  React.useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const board = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({
          isRevealed: false,
          isBomb: false,
          adjacentBombs: 0,
        }))
    );

    placeBombs(board);
    calculateAdjacentBombs(board);
    setGameBoard(board);
  };

  const placeBombs = (board) => {
    let bombsPlaced = 0;
    while (bombsPlaced < NUM_BOMBS) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (!board[row][col].isBomb) {
        board[row][col].isBomb = true;
        bombsPlaced++;
      }
    }
  };

  const calculateAdjacentBombs = (board) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!board[row][col].isBomb) {
          let count = 0;
          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              const newRow = row + r;
              const newCol = col + c;
              if (
                newRow >= 0 &&
                newRow < GRID_SIZE &&
                newCol >= 0 &&
                newCol < GRID_SIZE
              ) {
                if (board[newRow][newCol].isBomb) count++;
              }
            }
          }
          board[row][col].adjacentBombs = count;
        }
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (gameOver || gameBoard[row][col].isRevealed) return;

    const newBoard = [...gameBoard];
    if (newBoard[row][col].isBomb) {
      setGameOver(true);
      revealAllBombs(newBoard);
    } else {
      revealCell(newBoard, row, col);
    }
    setGameBoard(newBoard);
  };

  const revealCell = (board, row, col) => {
    if (
      row < 0 ||
      row >= GRID_SIZE ||
      col < 0 ||
      col >= GRID_SIZE ||
      board[row][col].isRevealed
    )
      return;

    board[row][col].isRevealed = true;

    if (board[row][col].adjacentBombs === 0) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          revealCell(board, row + r, col + c);
        }
      }
    }
  };

  const revealAllBombs = (board) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col].isBomb) {
          board[row][col].isRevealed = true;
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 font-sans">マインスイーパー</h1>
      <div className="grid gap-1 p-4 bg-gray-300 rounded-lg">
        {gameBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 flex items-center justify-center border border-gray-400 ${
                  cell.isRevealed
                    ? cell.isBomb
                      ? "bg-red-500"
                      : "bg-gray-100"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameOver || cell.isRevealed}
              >
                {cell.isRevealed &&
                  !cell.isBomb &&
                  cell.adjacentBombs > 0 &&
                  cell.adjacentBombs}
                {cell.isRevealed && cell.isBomb && "💣"}
              </button>
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold text-red-500 font-sans">
          ゲームオーバー
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-sans"
        onClick={initializeGame}
      >
        新しいゲーム
      </button>
    </div>
  );
}

export default MainComponent;
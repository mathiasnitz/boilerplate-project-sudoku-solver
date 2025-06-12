class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, error: "Expected puzzle to be 81 characters long" };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let c = 0; c < 9; c++) {
      if (c === column) continue;
      if (puzzleString[row * 9 + c] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r === row) continue;
      if (puzzleString[r * 9 + column] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currRow = startRow + r;
        const currCol = startCol + c;
        if (currRow === row && currCol === column) continue;

        const index = currRow * 9 + currCol;
        if (puzzleString[index] === value) return false;
      }
    }
    return true;
  }

  isValidSudokuState(puzzleString) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = puzzleString[row * 9 + col];
        if (val !== ".") {
          const temp = puzzleString.split("");
          temp[row * 9 + col] = ".";

          if (
            !this.checkRowPlacement(temp.join(""), row, col, val) ||
            !this.checkColPlacement(temp.join(""), row, col, val) ||
            !this.checkRegionPlacement(temp.join(""), row, col, val)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) return false;

    if (!this.isValidSudokuState(puzzleString)) return false;

    return this.backtrackSolve(puzzleString);
  }

  backtrackSolve(puzzleString) {
    const solveRecursive = (board) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row * 9 + col] === '.') {
            for (let val = 1; val <= 9; val++) {
              const strVal = val.toString();
              if (
                this.checkRowPlacement(board, row, col, strVal) &&
                this.checkColPlacement(board, row, col, strVal) &&
                this.checkRegionPlacement(board, row, col, strVal)
              ) {
                board = board.substring(0, row * 9 + col) + strVal + board.substring(row * 9 + col + 1);
                const result = solveRecursive(board);
                if (result) return result;
                board = board.substring(0, row * 9 + col) + '.' + board.substring(row * 9 + col + 1);
              }
            }
            return false;
          }
        }
      }
      return board;
    };

    return solveRecursive(puzzleString);
  }

}

module.exports = SudokuSolver;
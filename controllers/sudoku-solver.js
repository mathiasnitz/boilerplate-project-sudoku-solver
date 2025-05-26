class SudokuSolver {


  validate(puzzleString) {
    if(puzzleString.length !== 81){
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let start = row * 9;
    let end = start + 9;

    let rowValues = puzzleString.slice(start, end);

    if(rowValues.includes(value)) {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      let index = i * 9 + column;
      if (puzzleString[index] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;

    for(let r = 0; r < 3; r++){
      for(let c= 0; c < 3; c++){
        let index = (startRow + r) * 9 + (startCol + c);

        if(puzzleString[index] === value) {
          return false;
        }
      }
    }
    return true;

  }

  solve(puzzleString) {
    let index = puzzleString.indexOf('.');
    if (index === -1) {
      return puzzleString;
    }
  
    let row = Math.floor(index / 9);
    let col = index % 9;
  
    for (let num = 1; num <= 9; num++) {
      let value = num.toString();
  
      if (
        this.checkRowPlacement(puzzleString, row, col, value) &&
        this.checkColPlacement(puzzleString, row, col, value) &&
        this.checkRegionPlacement(puzzleString, row, col, value)
      ) {
        let newPuzzleString =
          puzzleString.slice(0, index) + value + puzzleString.slice(index + 1);
  
        let result = this.solve(newPuzzleString);
        if (result) return result;
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;


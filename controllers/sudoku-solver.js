class SudokuSolver {


  validate(puzzleString) {

    try {

      if(puzzleString.length === 81){
        console.log("this is a legit puzzle string homie");
      } else {
        console.log("error: puzzle string < 81 chars");
      }


    } catch(err){

    }

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
    
  }
}

module.exports = SudokuSolver;


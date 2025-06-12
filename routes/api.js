'use strict';

const express = require('express');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.use(express.json());

  app.route('/api/check')
    .post((req, res) => {

      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }
    
      if (/[^1-9.]/g.test(puzzle)) {
        return res.json({ error: "Invalid characters in puzzle" });
      }
    
      if (puzzle.length !== 81) {
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      }
    
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: "Invalid coordinate" });
      }
    
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: "Invalid value" });
      }

      const row = coordinate.charAt(0);
      const column = parseInt(coordinate.charAt(1), 10);

      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const colIndex = column - 1;

      const puzzleArray = puzzle.split("");
      const currentChar = puzzleArray[rowIndex * 9 + colIndex];

      if (currentChar === value) {
        return res.json({ valid: true });
      }

      puzzleArray[rowIndex * 9 + colIndex] = ".";

      const tempPuzzle = puzzleArray.join("");

      const isValidRow = solver.checkRowPlacement(tempPuzzle, rowIndex, colIndex, value);
      const isValidCol = solver.checkColPlacement(tempPuzzle, rowIndex, colIndex, value);
      const isValidReg = solver.checkRegionPlacement(tempPuzzle, rowIndex, colIndex, value);

      
      if(isValidRow && isValidCol && isValidReg){
        return res.json({ valid: true });
      }

      const conflict = [];
      if(!isValidRow) conflict.push("row");
      if(!isValidCol) conflict.push("column");
      if(!isValidReg) conflict.push("region");

      return res.json({
        valid: false,
        conflict
      });

    });
    
    app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const validation = solver.validate(puzzle);
  
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      const solved = solver.solve(puzzle);

      if (!solved) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
      return res.json({ solution: solved });

    });
  
};

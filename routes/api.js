'use strict';

const express = require('express');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.use(express.json());

  app.route('/api/check')
    .post((req, res) => {

      const { puzzle, coordinate, value } = req.body;

      const row = coordinate.charAt(0);
      const column = parseInt(coordinate.charAt(1), 10);

      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const colIndex = column - 1;

      const isValidRow = solver.checkRowPlacement(puzzle, rowIndex, colIndex, value);
      const isValidCol = solver.checkColPlacement(puzzle, rowIndex, colIndex, value);
      const isValidReg = solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value);



      if(isValidRow){

        if(isValidCol){
          console.log("Row und Col sind true");
          
          if(isValidReg){
            console.log("Row und Col und Block sind true");
            res.json({ isValidRow: true, isValidCol: true, isValidReg: true });
          }
        } 
      } else {
        res.json({ isValidRow: false, error: 'double value in row' });
      }
      

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      
      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid puzzle string' });
      }
  
      const solved = solver.solve(puzzle);
      if (!solved) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
      return res.json({ solution: solved });
  });
  
};

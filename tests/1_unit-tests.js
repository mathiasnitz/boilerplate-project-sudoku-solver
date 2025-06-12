const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");

let solver = new Solver();

suite("Unit Tests", () => {

  const validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

  test("Valid puzzle string of 81 characters", () => {
    assert.lengthOf(validPuzzle, 81);
  });

  test("Puzzle string with invalid characters", () => {
    const invalid = "1.2x3456789".repeat(8) + "1";
    assert.isFalse(solver.validate(invalid).valid);
  });

  test("Puzzle string with incorrect length", () => {
    const short = "123456789";
    assert.isFalse(solver.validate(short).valid);
  });

  test("Valid row placement", () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, "3"));
  });

  test("Invalid row placement", () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, "5"));
  });

  test("Valid column placement", () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, "6"));
  });

  test("Invalid column placement", () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, "9"));
  });

  test("Valid region placement", () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, "1"));
  });

  test("Invalid region placement", () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, "3"));
  });

  test("Solves a valid puzzle", () => {
    assert.equal(solver.solve(validPuzzle), solution);
  });

  test("Fails to solve an unsolvable puzzle", () => {
    const badPuzzle = "9".repeat(81);
    assert.isFalse(solver.solve(badPuzzle));
  });

});
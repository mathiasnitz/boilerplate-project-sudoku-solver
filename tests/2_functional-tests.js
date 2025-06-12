const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const { inv } = require("16");
const { assert } = chai;

chai.use(chaiHttp);

const validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const invalidPuzzle = "..9..5.1.85.4....2432......1xx.69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const solvedPuzzle = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";

suite("Functional Tests", () => {
  suite("POST /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", done => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, solvedPuzzle);
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", done => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });

    test("Solve a puzzle with invalid characters", done => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });

    test("Solve a puzzle with incorrect length", done => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "123456789" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", done => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "9".repeat(81) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });

  suite("POST /api/check", () => {
    test("Check a puzzle placement with all fields", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "B1", value: "9" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["region"]);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "5" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.includeMembers(res.body.conflict, ["row", "region"]);
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "5" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "1.2x3456789".repeat(8) + "1", coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: "123456789", coordinate: "A2", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "Z9", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid coordinate" });
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", done => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "0" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid value" });
          done();
        });
    });
  });
});

const fs = require("fs");
let input = fs
  .readFileSync("/Users/jenswilms/Downloads/input4.txt", "utf8")
  .split("\n\n")
  .map((n) => n);

const draws = input[0].split(",").map((n) => Number(n));
const rawBoards = input.slice(1);
let boards = [];

//transforming data
rawBoards.map((n) => {
  let singleRawBoard = n.split("\n").map((m) => m);
  let singleBoard = [];
  singleRawBoard.map((o) => {
    let singleRow = o
      .split(" ")
      .filter((q) => q)
      .map((p) => {
        return {
          value: Number(p),
          chosen: false,
        };
      });
    if (singleRow.length > 0) {
      singleBoard.push(singleRow);
    }
  });
  boards.push(singleBoard);
});

let winners = [];

function calcUnmarked(board) {
  let sumUnmarked = 0;
  //check all rows
  for (let i = 0; i < board.length; i++) {
    //check all items
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].chosen) sumUnmarked += board[i][j].value;
    }
  }

  return sumUnmarked;
}

function draw(drawNumber) {
  //check all boards
  for (let i = 0; i < boards.length; i++) {
    let winner;

    //check each row
    let amountColumnChosen = [0, 0, 0, 0, 0];

    for (let j = 0; j < boards[i].length; j++) {
      let amountRowChosen = 0;

      //check each item
      for (let k = 0; k < boards[i][j].length; k++) {
        //draw and select chosen
        if (boards[i][j][k].value === drawNumber) {
          boards[i][j][k].chosen = true;
        }

        //mark this one as chosen
        if (boards[i][j][k].chosen) {
          amountRowChosen++;
          amountColumnChosen[k]++;
        }
      }

      //if there is a full row, then rowCompleted = true
      if (amountRowChosen === boards[i][j].length) {
        winner = {
          row: true,
          values: boards[i][j].map((x) => x.value),
          board: boards[i],
          index: i,
        };
      }
    }

    //check if there is a full column
    const fullColumnIndex = amountColumnChosen.indexOf(boards[i].length);
    if (fullColumnIndex !== -1) {
      let values = boards[i].map((m) => m[fullColumnIndex].value);
      winner = {
        row: false,
        values: values,
        board: boards[i],
        index: i,
      };
      //   winners.push(winner);
    }

    //check winners
    if (winner) {
      winner.draw = drawNumber;
      winner.sumUnmarked = calcUnmarked(winner.board);
      winner.inputLength = boards.length;
      //remove board from draws;
      //   boards.splice(winner.index, 1);
      winners.push(winner);
    }
  }
}

function playBingo() {
  const luckyDraws = [25, 36, 74, 33, 63];
  const columnDraws = [92, 90, 15, 84, 25];

  //   let winner;

  for (let i = 0; i < draws.length; i++) {
    draw(draws[i]);
    // if (boards.length === 1) {
    //   break;
    // }
  }
}

function findLastWinner(winnerBoards) {
  const allBoards = [...new Set(winnerBoards.map((i) => i.board))];
  const lastWinningBoard = allBoards[allBoards.length - 1];
  // all wins of last winning board
  const boardWins = winnerBoards.filter((i) => i.board === lastWinningBoard);
  // first win of last winning board
  const firstWin = boardWins[0];
  return firstWin;
}

playBingo();
// console.log(findLastWinner(winners));
console.log(findLastWinner(winners).draw * findLastWinner(winners).sumUnmarked);
// winners.slice(-3).map((item) => {
//   console.log(item.board);
// });
// console.log(winners);

// console.log(winners.slice(-1)[0].draw * winners.slice(-3)[0].sumUnmarked);

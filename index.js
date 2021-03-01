var pattern = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

var chessPlayer = 1; // 存放当前棋手，1 为 o（用户），2为 x（计算机）

/**
 * 显示棋盘
 */
function show() {
  var board = document.getElementById('board');
  board.innerHTML = '';

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var oCell = document.createElement('div');
      oCell.classList.add('cell');
      oCell.innerText =
        pattern[i][j] === 2 ? '×' :
        pattern[i][j] === 1 ? 'o' : '';

      (function (i, j) {
        oCell.onclick = function () {
          userMove(i, j);
        };
      })(i, j)

      board.appendChild(oCell);
    }

    board.appendChild(document.createElement('br'));
  }
}

/**
 * 用户下棋
 * @param {*} x 棋盘的行
 * @param {*} y 棋盘的列
 */
function userMove(x, y) {
  if (pattern[x][y]) {
    return
  };

  pattern[x][y] = chessPlayer;

  if (check(pattern, chessPlayer)) {
    win();
  }

  chessPlayer = 3 - chessPlayer;
  show();
  computerMove();
}

/**
 * 计算机下棋
 */
function computerMove() {
  var choice = bestChoice(pattern, chessPlayer);

  if (choice.point) {
    pattern[choice.point[0]][choice.point[1]] = chessPlayer;
  }

  if (check(pattern, chessPlayer)) {
    win();
  }

  chessPlayer = 3 - chessPlayer;
  setTimeout(show, 300);
}

/**
 * 检查是否有棋手赢棋
 * @param {*} pattern 棋盘数组
 * @param {*} chessPlayer 当前棋手
 */
function check(pattern, chessPlayer) {
  // 检查横行 一
  for (var i = 0; i < 3; i++) {
    var winX = true;

    for (var j = 0; j < 3; j++) {
      if (pattern[i][j] !== chessPlayer) {
        winX = false;
        break;
      }
    }

    if (winX) {
      return true
    };
  }

  // 检查纵行 |
  for (var i = 0; i < 3; i++) {
    var winY = true;

    for (var j = 0; j < 3; j++) {
      if (pattern[j][i] !== chessPlayer) {
        winY = false;
        break;
      }
    }

    if (winY) {
      return true
    };
  }

  // 检查斜行 \
  var winS1 = true;
  for (let i = 0; i < 3; i++) {
    if (pattern[i][i] !== chessPlayer) {
      winS1 = false;
      break;
    }
  }
  if (winS1) {
    return true
  }


  // 检查斜行 /
  var winS2 = true;
  for (var i = 0; i < 3; i++) {
    if (pattern[i][2 - i] !== chessPlayer) {
      winS2 = false;
      break;
    }
  }
  if (winS2) {
    return true;
  }

  return false;
}

/**
 * 克隆一个数组
 * @param {*} pattern 
 */
function clone(pattern) {
  return JSON.parse(JSON.stringify(pattern));
}

/**
 * 判断某一个棋手能否赢
 * @param {*} pattern 棋盘
 * @param {*} chessPlayer 棋手
 */
function willWin(pattern, chessPlayer) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (pattern[i][j]) {
        continue;
      }

      var tmp = clone(pattern);
      tmp[i][j] = chessPlayer;
      if (check(tmp, chessPlayer)) {
        return [i, j];
      }
    }
  }

  return null;
}

/**
 * 某个棋手最好的选择
 * @param {*} pattern 棋盘
 * @param {*} chessPlayer 棋手
 */
function bestChoice(pattern, chessPlayer) {
  var p;
  if (p = willWin(pattern, chessPlayer)) {
    return {
      point: p,
      result: 1,
    }
  }

  var result = -2;
  loop1: for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (pattern[i][j]) {
        continue;
      }

      var tmp = clone(pattern);
      tmp[i][j] = chessPlayer;
      var r = bestChoice(tmp, 3 - chessPlayer).result;

      if (-r > result) {
        result = -r;
        p = [i, j];
      }

      if (result === 1) {
        break loop1;
      }
    }
  }

  return {
    point: p,
    result: p ? result : 0,
  }
}

/**
 * 胜利函数
 */
function win() {
  var oWin = document.createElement('div');
  oWin.classList.add('win');
  oWin.innerHTML = chessPlayer === 2 ? "计算机 win!!!" : "你 win!!!";

  oWin.onclick = function () {
    location.reload();
  }

  setTimeout(function () {
    board.appendChild(oWin);
  }, 500)
}

show();
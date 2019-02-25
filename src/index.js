module.exports = function solveSudoku(matrix) {
  let change = false;

  const isContain = function (n, ...array) {
    return array.some((r) => r.some((c) => c === n));
  };

  const getUnit = function (i, j) {
    const unit = [];
    for (let y = 0; y < 3; y++) {
      let r = Math.floor(i / 3) * 3 + y;
      let c = Math.floor(j / 3) * 3;
      unit.push(...matrix[r].slice(c, c + 3));
    }
    return unit;
  };

  const solveUniq = function (i, j) {
    const matrixRow = matrix[i];

    const matrixColumn = [];
    for (let y = 0; y < 9; y++) {
      matrixColumn[y] = matrix[y][j];
    }

    const matrixUnit = getUnit(i, j);

    let suggest = [];
    for (let n = 1; n < 10; n++) {
      if (!isContain(n, matrixRow, matrixColumn, matrixUnit)) {
        suggest.push(n);
      }
    }

    if (suggest.length === 1) {
      change = true;
      matrix[i][j] = suggest[0];
    } else {
      matrix[i][j] = suggest;
    }
  };

  const getArrayDiff = function (arr1, arr2) {
    const arrDiff = [];
    for (let i = 0; i < arr1.length; i++) {
      let isFound = false;
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i] === arr2[j]) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        arrDiff[arrDiff.length] = arr1[i];
      }
    }
    return arrDiff;
  };

  const getRowSuggest = function (i, j) {
    let suggest = matrix[i][j];

    for (let k = 0; k < 9; k++) {
      if (k === j || !Array.isArray(matrix[i][j])) {
        continue;
      }
      suggest = getArrayDiff(suggest, matrix[i][k]);
    }

    return suggest;
  };

  const getColSuggest = function (i, j) {
    let suggest = matrix[i][j];

    for (let k = 0; k < 9; k++) {
      if (k === i || !Array.isArray(matrix[i][j])) {
        continue;
      }
      suggest = getArrayDiff(suggest, matrix[k][j]);
    }

    return suggest;
  };

  const getUnitSuggest = function (i, j) {
    let matrixUnit = getUnit(i, j);

    let suggest = matrix[i][j];
    for (let k = 1; k < 9; k++) {
      if (!Array.isArray(matrixUnit[k])) {
        continue;
      }
      suggest = getArrayDiff(suggest, matrixUnit[k]);
    }

    return suggest;
  };

  const writeSingleSuggest = function (lessSuggest, i, j) {
    if (lessSuggest.length === 1) {
      matrix[i][j] = lessSuggest[0];
      change = true;
    }
  };

  const solveHiddenUniq = function (i, j) {
    let diffSuggest = [];

    diffSuggest = getRowSuggest(i, j);
    writeSingleSuggest(diffSuggest, i, j);

    diffSuggest = getColSuggest(i, j);
    writeSingleSuggest(diffSuggest, i, j);

    diffSuggest = getUnitSuggest(i, j);
    writeSingleSuggest(diffSuggest, i, j);
  };

  const isSolved = function (array) {
    return array.some((r) => r.some((c) => Array.isArray(c)));
  };

  const backtracking = function () {
    const matrixCopy = matrix.map((r) => [...r]);
    let minSuggest = {};

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (minSuggest.length && (matrix[i][j].length < minSuggest.length) ||
        Array.isArray(matrix[i][j]) && !minSuggest.length) {
          minSuggest = {
            i,
            j,
            value: matrix[i][j],
            length: matrix[i][j].length
          };
        }
      }
    }

    for (let k = 0; k < minSuggest.length; k++) {
      matrixCopy[minSuggest.i][minSuggest.j] = minSuggest.value[k];
      let solution = solveSudoku(matrixCopy);
      if (solution && !isSolved(solution)) {
        matrix = solution.map((r) => [...r]);
        return;
      }
    }
  };

  const updateSuggest = function () {
    change = false;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Array.isArray(matrix[i][j]) || matrix[i][j] === 0) {
          solveUniq(i, j);
          solveHiddenUniq(i, j);
        }
      }
    }
  };

  do {
    updateSuggest();
  } while (change);

  if (isSolved(matrix)) {
    backtracking();
  }

  return matrix;
};

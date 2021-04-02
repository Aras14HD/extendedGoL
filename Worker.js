onmessage = function (e) {
  let cells = JSON.parse(e.data[0]);
  let column = e.data[1];
  let row = e.data[2];

  let n = 0.0;
  if (column > 0) {
    if (row > 0) {
      n += parseFloat(cells[column - 1][row - 1]);
    } else {
      n += parseFloat(cells[column - 1][rows - 1]);
    }
    n += parseFloat(cells[column - 1][row]);
    if (row < rows - 1) {
      n += parseFloat(cells[column - 1][row + 1]);
    } else {
      n += parseFloat(cells[column - 1][0]);
    }
  } else {
    if (row > 0) {
      n += parseFloat(cells[columns - 1][row - 1]);
    } else {
      n += parseFloat(cells[columns - 1][rows - 1]);
    }
    n += parseFloat(cells[columns - 1][row]);
    if (row < rows - 1) {
      n += parseFloat(cells[columns - 1][row + 1]);
    } else {
      n += parseFloat(cells[columns - 1][0]);
    }
  }
  if (row > 0) {
    n += parseFloat(cells[column][row - 1]);
  } else n += parseFloat(cells[column][rows - 1]);
  if (row < rows - 1) {
    n += parseFloat(cells[column][row + 1]);
  } else n += parseFloat(cells[column][0]);
  if (column < columns - 1) {
    if (row > 0) {
      n += parseFloat(cells[column + 1][row - 1]);
    } else n += parseFloat(cells[column + 1][rows - 1]);
    n += parseFloat(cells[column + 1][row]);
    if (row < rows - 1) {
      n += parseFloat(cells[column + 1][row + 1]);
    } else n += parseFloat(cells[column + 1][0]);
  } else {
    if (row > 0) {
      n += parseFloat(cells[0][row - 1]);
    } else n += parseFloat(cells[0][rows - 1]);
    n += parseFloat(cells[0][row]);
    if (row < rows - 1) {
      n += parseFloat(cells[0][row + 1]);
    } else n += parseFloat(cells[0][0]);
  }

  postMessage([n, column, row]);
};

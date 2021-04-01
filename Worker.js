onmessage = function (e) {
  let cells = JSON.parse(e.data[0]).cells;
  let columns = e.data[1];
  let rows = e.data[2];

  let tcells = [];
  for (let column = 0; column < cells.length; column++) {
    tcells.push([]);
    for (let row = 0; row < cells[column].length; row++) {
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

      if (cells[column][row] >= 0.5) {
        tcells[column][row] = -0.5 * (n - 2.5) * (n - 2.5) + 1.125;
      } else {
        tcells[column][row] = -1 * (n - 3) * (n - 3) + 1;
      }
      if (tcells[column][row] < 0) tcells[column][row] = 0;
      if (tcells[column][row] > 1) tcells[column][row] = 1;
    }
  }
  postMessage(JSON.stringify({ tcells: tcells }));
};

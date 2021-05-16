onmessage = function (e) {
  let cells = JSON.parse(e.data[0]);
  let columns = e.data[1];
  let rows = e.data[2];

  let tcells = [];
  for (let column = 0; column < cells.length; column++) {
    tcells.push([]);
    for (let row = 0; row < cells[column].length; row++) {
      let n = 0.0;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          if (x != 0 || y != 0) {
            let neighbor_column, neighbor_row;

            if (x == -1 && column == 0) {
              neighbor_column = columns - 1;
            } else if (x == 1 && column == columns - 1) {
              neighbor_column = 0;
            } else neighbor_column = column + x;

            if (y == -1 && row == 0) {
              neighbor_row = rows - 1;
            } else if (y == 1 && row == rows - 1) {
              neighbor_row = 0;
            } else neighbor_row = row + y;

            if (
              cells[neighbor_column] != undefined &&
              cells[neighbor_column][neighbor_row] != undefined
            ) {
              n += parseFloat(cells[neighbor_column][neighbor_row]);
            }
          }
        }
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
  postMessage(JSON.stringify(tcells));
};

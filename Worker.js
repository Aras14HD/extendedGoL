onmessage = function(e) {
  let cells = JSON.parse(e.data[0]);
  let columns = e.data[1];
  let rows = e.data[2];

  //Map
  tcells = cells.map((col, column) =>
    col.map((cell, row) => {
      let tcell;
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

      if (cell >= 0.5) {
        tcell = -0.5 * (n - 2.5) * (n - 2.5) + 1.125;
      } else {
        tcell = -1 * (n - 3) * (n - 3) + 1;
      }
      if (tcell < 0) tcell = 0;
      if (tcell > 1) tcell = 1;
      return tcell;
    })
  );

  postMessage(JSON.stringify(tcells));
};

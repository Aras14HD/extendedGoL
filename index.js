const url = new URL(window.location.href);
const rows = url.searchParams.get("w") || 200;
const columns = url.searchParams.get("w") || 200;
const speed = url.searchParams.get("s") || 60;

let pause = true;
let x = 1;
let cells = [];
for (let column = 0; column < columns; column++) {
  cells.push([]);
  for (let row = 0; row < rows; row++) {
    cells[column][row] = 0;
  }
}
console.log(cells);
document.addEventListener("DOMContentLoaded", function () {
  let html = "";
  for (let column = 0; column < columns; column++) {
    html += `<div class="column" id="column-${column}">`;
    for (let row = 0; row < rows; row++) {
      html += `<div class="cell column-${column} row-${row}" id="cell-${column}:${row}"></div>`;
    }
    html += `</div>`;
  }
  document.getElementById("pause").addEventListener("click", () => {
    pause = !pause;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key == " ") pause = !pause;
  });
  /*document.getElementById("speed").addEventListener("input", (e) => {
    speed = e.target.value;
  });*/
  document
    .getElementById("container")
    .addEventListener("click", (e) => toggleCell(e));
  document.getElementById("x").addEventListener("input", (e) => {
    x = e.target.value;
  });
  new Promise((resolve) => {
    document.getElementById("container").innerHTML = html;
    resolve(document.getElementById("container").innerHTML);
  }).then(() => {
    initCells();
  });
});
function initCells() {
  cellarray = document.getElementsByClassName("cell");
  for (let i = 0; i < cellarray.length; i++) {
    cell = cellarray[i];
    cell.style.width = 800 / columns;
    cell.style.height = 800 / rows;
  }
  window.setInterval(run, speed);
  window.setInterval(drawCells, speed);
}
function toggleCell(e) {
  let canvas = document.getElementById("container").getContext("2d");
  let pos = getMousePos(document.getElementById("container"), e);
  let column = Math.round(pos.x / (800 / columns)) - 1;
  let row = Math.round(pos.y / (800 / rows)) - 1;

  if (column > columns - 1) column = columns - 1;
  if (column < 0) column = 0;
  if (row > rows - 1) row = rows - 1;
  if (row < 0) row = 0;

  switch (cells[column][row]) {
    case x:
      cells[column][row] = 0;
      break;
    default:
      cells[column][row] = x;
  }
  canvas.fillStyle = `hsl(0, 0%, ${(-1 * cells[column][row] + 1) * 100}%)`;
  canvas.fillRect(
    column * (800 / columns),
    row * (800 / rows),
    800 / columns,
    800 / columns
  );
}
function run() {
  if (!pause) {
    //debug vars
    let y = [0, 0, 0, 0, 0];

    let tcells = [];
    for (let column = 0; column < cells.length; column++) {
      tcells.push([]);
      for (let row = 0; row < cells[column].length; row++) {
        //sum of neighbors
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
          y[2] += n;
        } else {
          tcells[column][row] = -1 * (n - 3) * (n - 3) + 1;
          y[3] += n;
        }
        if (tcells[column][row] < 0) tcells[column][row] = 0;
        if (tcells[column][row] > 1) tcells[column][row] = 1;
        y[0] += parseFloat(tcells[column][row]);
        y[1] += n;
        if (
          tcells[column][row] == cells[column][row] &&
          cells[column][row] != 0
        )
          y[4]++;
      }
    }
    /*console.debug(
      y[0] / (columns * rows) +
        "|" +
        y[1] / (columns * rows) +
        "|" +
        y[2] / (columns * rows) +
        "|" +
        y[3] / (columns * rows)
    );*/
    //console.debug(y[4]);
    cells = tcells;
  }
}
function drawCells() {
  if (!pause) {
    let canvas = document.getElementById("container").getContext("2d");
    for (let column = 0; column < cells.length; column++) {
      for (let row = 0; row < cells[column].length; row++) {
        if (
          canvas.fillStyle !=
          `hsl(0, 0%, ${(-1 * cells[column][row] + 1) * 100}%)`
        ) {
          canvas.fillStyle = `hsl(0, 0%, ${
            (-1 * cells[column][row] + 1) * 100
          }%)`;
          canvas.fillRect(
            column * (800 / columns),
            row * (800 / rows),
            800 / columns,
            800 / columns
          );
        }
      }
    }
  }
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

let rows = 200;
let columns = 200;
let cells = [];
let pause = true;
let speed = 60;
let x = 1;
let ms = 0;
let i = 0;
for (let column = 0; column < columns; column++) {
  cells.push([]);
  for (let row = 0; row < rows; row++) {
    cells[column][row] = 0;
  }
}
console.log(cells);
document.addEventListener("DOMContentLoaded", function () {
  worker = new Worker("Worker.js");
  let html = "";
  for (let column = 0; column < columns; column++) {
    html += "<div class='column' id='column-" + column + "'>";
    for (let row = 0; row < rows; row++) {
      html +=
        "<div class='cell column-" +
        column +
        " row-" +
        row +
        "' id='cell-" +
        column +
        ":" +
        row +
        "'></div>";
    }
    html += "</div>";
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
  let xpos = e.layerX;
  let ypos = e.layerY;
  let column = Math.round(xpos / (800 / columns) - 800 / columns / 2) - 1;
  let row = Math.round(ypos / (800 / rows) - 800 / rows / 2) - 1;
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
  canvas.fillStyle = "hsl(0, 0%, " + (-1 * cells[column][row] + 1) * 100 + "%)";
  canvas.fillRect(
    column * (800 / columns),
    row * (800 / rows),
    800 / columns,
    800 / columns
  );
}
async function run() {
  if (!pause) {
    tcells = [];
    worker = [];
    i = 0;
    for (let column = 0; column < cells.length; column++) {
      tcells.push([]);
      worker.push([]);
      for (let row = 0; row < cells[column].length; row++) {
        _cells = JSON.stringify(cells);
        worker.postMessage([_cells, column, row]);

        worker.addEventListener("message", (e) => {
          n = e.data[0];
          column = e.data[1];
          row = e.data[2];
          i++;

          if (cells[column][row] >= 0.5) {
            tcells[column][row] = -0.5 * (n - 2.5) * (n - 2.5) + 1.125;
          } else {
            tcells[column][row] = -1 * (n - 3) * (n - 3) + 1;
          }
          if (tcells[column][row] < 0) tcells[column][row] = 0;
          if (tcells[column][row] > 1) tcells[column][row] = 1;

          worker[column][row].terminate();
          if (i == cells.length * cells[0].length) {
            cells = tcells;
          }
        });
      }
    }
  }
}
async function drawCells() {
  if (!pause) {
    let canvas = document.getElementById("container").getContext("2d");
    for (let column = 0; column < cells.length; column++) {
      for (let row = 0; row < cells[column].length; row++) {
        canvas.fillStyle =
          "hsl(0, 0%, " + (-1 * cells[column][row] + 1) * 100 + "%)";
        canvas.fillRect(
          column * (800 / columns),
          row * (800 / rows),
          800 / columns,
          800 / columns
        );
      }
    }
    console.log(ms);
    ms = 0;
  }
}

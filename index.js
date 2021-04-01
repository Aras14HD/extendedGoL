let rows = 200;
let columns = 200;
let cells = [];
let pause = true;
let speed = 60;
let x = 1;
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
  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < rows; row++) {
      document
        .getElementById("cell-" + column + ":" + row)
        .addEventListener("click", (e) => {
          toggleCell(e);
        });
    }
  }
  window.setInterval(run, speed);
}
async function toggleCell(cell) {
  let column = cell.target.className.split(" ")[1].replace("column-", "");
  let row = cell.target.className.split(" ")[2].replace("row-", "");
  switch (cells[column][row]) {
    case x:
      cell.target.style.background = "hsl(0, 0%, 100%)";
      cells[column][row] = 0;
      break;
    default:
      cell.target.style.background = "hsl(0, 0%, " + (-1 * x + 1) * 100 + "%)";
      cells[column][row] = x;
  }
}
async function run() {
  if (!pause) {
    _cells = "" + cells;
    worker = new Worker("Worker.js");
    worker.postMessage([_cells, columns, rows]);
    worker.onmessage = function (tcells) {
      cells = tcells;
      for (let column = 0; column < cells.length; column++) {
        for (let row = 0; row < cells[column].length; row++) {
          document.getElementById(
            "cell-" + column + ":" + row
          ).style.background =
            "hsl(0, 0%, " + (-1 * cells[column][row] + 1) * 100 + "%)";
        }
      }
    };
  }
}

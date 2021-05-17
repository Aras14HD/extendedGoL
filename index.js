const url = new URL(window.location.href);
const rows = url.searchParams.get("w") || 200;
const columns = url.searchParams.get("w") || 200;
const speed = url.searchParams.get("s") || 60;

let cells = [];
let pause = true;
let x = 1;
let ms = 0;
for (let column = 0; column < columns; column++) {
  cells.push([]);
  for (let row = 0; row < rows; row++) {
    cells[column][row] = 0;
  }
}
console.log(cells);
document.addEventListener("DOMContentLoaded", function() {
  worker = new Worker("Worker.js");
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
  document.addEventListener("keydown", e => {
    if (e.key == " ") pause = !pause;
  });
  /*document.getElementById("speed").addEventListener("input", (e) => {
    speed = e.target.value;
  });*/
  document
    .getElementById("container")
    .addEventListener("click", e => toggleCell(e));
  document.getElementById("x").addEventListener("input", e => {
    x = e.target.value;
  });
  new Promise(resolve => {
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
    _cells = JSON.stringify(cells);
    worker.postMessage([_cells, columns, rows]);
    worker.onmessage = function(e) {
      cells = JSON.parse(e.data);
      ms++;
    };
  }
}
async function drawCells() {
  if (!pause) {
    let canvas = document.getElementById("container").getContext("2d");
    for (let column = 0; column < cells.length; column++) {
      for (let row = 0; row < cells[column].length; row++) {
        if (
          canvas.fillStyle !=
          `hsl(0, 0%, ${(-1 * cells[column][row] + 1) * 100}%)`
        ) {
          canvas.fillStyle = `hsl(0, 0%, ${(-1 * cells[column][row] + 1) *
            100}%)`;
          canvas.fillRect(
            column * (800 / columns),
            row * (800 / rows),
            800 / columns,
            800 / columns
          );
        }
      }
    }
    console.log(ms);
    ms = 0;
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

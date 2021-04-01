let rows = 100;
let columns = 100;
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
  window.setInterval(drawCells, speed);
}
function toggleCell(cell) {
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
function run() {
  if (!pause) {
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

    cells = tcells;
  }
}
function drawCells() {
  for (let column = 0; column < cells.length; column++) {
    for (let row = 0; row < cells[column].length; row++) {
      document.getElementById("cell-" + column + ":" + row).style.background =
        "hsl(0, 0%, " + (-1 * cells[column][row] + 1) * 100 + "%)";
    }
  }
}

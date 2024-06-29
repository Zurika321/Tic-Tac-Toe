const sizeInput = document.getElementById("sizeInput");
const winCondition_Input = document.getElementById("winCondition_Input");
let winCondition = 5;
function winCondition_() {
  if (winCondition_Input.value > size) {
    alert("Không thể đặt đồ dài hàng thắng lớn hơn kích thước bảng");
  } else {
    winCondition = parseInt(winCondition_Input.value);
    document.getElementById("winCondition_Input").value =
      winCondition_Input.value;
    reset("all");
  }
}
let size = parseInt(sizeInput.value);
// Tạo bảng với kích thước tùy chỉnh
function createTable() {
  size = parseInt(sizeInput.value);

  if (size < 5) {
    for (let i = 0; i < 5; i++) {
      if (i == size) {
        winCondition = i;
        document.getElementById("winCondition_Input").value = i;
      }
    }
  }

  const table = document
    .getElementById("myTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = ""; // Xóa bảng hiện tại nếu có

  for (let i = 0; i < size; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < size; j++) {
      const td = document.createElement("td");
      td.setAttribute("data-index", i * size + j);
      td.addEventListener("click", handleClick);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  //Tạo mới
  reset();
}

let thuaditruoc = true;
function turm() {
  document.getElementById("turm_div").textContent = currentPlayer;
}
function pick_turm(value) {
  if (value !== "thuaditruoc") {
    thuaditruoc = false;
    currentPlayer = "O";
  } else {
    thuaditruoc = true;
  }
  reset("all");
}

// Tạo mảng a với giá trị ban đầu
let a = [];
let currentPlayer = "O";
let playing = "";
let currentPlayer_now = "X";
let currentPlayer_change = "";
function reset(all) {
  if (all === "all") {
    const tdElements = document.querySelectorAll("td");
    tdElements.forEach((td) => {
      while (td.firstChild) {
        td.removeChild(td.firstChild);
      }
      td.textContent = "";
      td.classList.remove("highlight");
    });

    if (!thuaditruoc) {
      currentPlayer = document.getElementById("select").value;
      currentPlayer_now = currentPlayer;
    } else {
      currentPlayer = currentPlayer === "O" ? "X" : "O"; // Chuyển lượt
      currentPlayer_now = currentPlayer;
    }
  } else {
    currentPlayer = currentPlayer_now;
  }

  a = Array(size * size).fill("0");
  playing = "";
  turm();
  document.getElementById("newgame").style.display = "none";
}

let emotions = [":))", "^-^", ":((", ">:)", ":D", ":P", ":'(", ":|"];
// Hàm xử lý khi người chơi đánh dấu vào một ô
function handleClick(event) {
  if (playing == "") {
    const td = event.target;
    const index = td.getAttribute("data-index");

    if (a[index] === "0") {
      // Kiểm tra nếu ô trống
      a[index] = currentPlayer;
      td.textContent = currentPlayer;
      td.style.color = currentPlayer === "X" ? "red" : "blue";

      // Kiểm tra người thắng cuộc
      if (checkWinnerInTable(currentPlayer, index)) {
        alert(currentPlayer + " thắng!");
        playing = currentPlayer + " thắng!";
        document.getElementById("newgame").style.display = "block";
        let randomIndex = Math.floor(Math.random() * emotions.length);
        document.getElementById("turm_div").textContent = emotions[randomIndex];
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Chuyển lượt
        turm();
      }
    }
  } else {
    alert(playing);
  }
}

// Hàm kiểm tra người thắng cuộc và tô màu hàng chiến thắng
function checkWinnerInTable(player, index) {
  const size = Math.sqrt(a.length);

  // Chuyển mảng 1D thành mảng 2D
  const board = [];
  for (let i = 0; i < size; i++) {
    board.push(a.slice(i * size, i * size + size));
  }

  // Hàm để kiểm tra xem có 5 số liên tiếp giống nhau trong một mảng không
  function hasFiveInARow(arr) {
    let count = 0;
    const winningIndices = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === player) {
        count++;
        winningIndices.push(i);
        if (count === winCondition) {
          return winningIndices;
        }
      } else {
        count = 0;
        winningIndices.length = 0;
      }
    }
    return false;
  }

  // Kiểm tra hàng ngang, dọc, và chéo
  const row = Math.floor(index / size);
  const col = index % size;

  // Kiểm tra hàng ngang
  let result = hasFiveInARow(board[row]);
  if (result) {
    highlightWinningCells(row, result, true);
    return true;
  }

  // Kiểm tra hàng dọc
  const colArray = board.map((row) => row[col]);
  result = hasFiveInARow(colArray);
  if (result) {
    highlightWinningCells(col, result, false);
    return true;
  }

  // Kiểm tra đường chéo trái trên đến phải dưới
  let diagArray1 = [];
  let diagIndices1 = [];
  for (let i = -Math.min(row, col); i < Math.min(size - row, size - col); i++) {
    diagArray1.push(board[row + i][col + i]);
    diagIndices1.push((row + i) * size + (col + i));
  }
  result = hasFiveInARow(diagArray1);
  if (result) {
    highlightWinningCells(
      null,
      result.map((i) => diagIndices1[i]),
      true
    );
    return true;
  }

  // Kiểm tra đường chéo trái dưới đến phải trên
  let diagArray2 = [];
  let diagIndices2 = [];
  for (
    let i = -Math.min(size - 1 - row, col);
    i < Math.min(row + 1, size - col);
    i++
  ) {
    diagArray2.push(board[row - i][col + i]);
    diagIndices2.push((row - i) * size + (col + i));
  }
  result = hasFiveInARow(diagArray2);
  if (result) {
    highlightWinningCells(
      null,
      result.map((i) => diagIndices2[i]),
      true
    );
    return true;
  }

  return false;
}

// Hàm tô màu ô chiến thắng
function highlightWinningCells(rowOrCol, indices, isRow) {
  if (rowOrCol !== null) {
    indices.forEach((i) => {
      const cellIndex = isRow
        ? rowOrCol * Math.sqrt(a.length) + i
        : i * Math.sqrt(a.length) + rowOrCol;
      document
        .querySelector(`td[data-index="${cellIndex}"]`)
        .classList.add("highlight");
    });
  } else {
    indices.forEach((i) => {
      document
        .querySelector(`td[data-index="${i}"]`)
        .classList.add("highlight");
    });
  }
}

// Gọi hàm tạo bảng với kích thước mặc định khi tải trang
document.addEventListener("DOMContentLoaded", createTable);

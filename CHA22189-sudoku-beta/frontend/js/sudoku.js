document.addEventListener("DOMContentLoaded", async () => {
    const sudokuSelect = document.getElementById("sudokuSelect");
    const loadSudokuButton = document.getElementById("loadSudoku");
    const solveSudokuButton = document.getElementById("solveSudoku");
    const sudokuGrid = document.getElementById("sudokuGrid");

    let currentSudoku = null; // Speichert das geladene Sudoku

    // Lade die Liste der Sudoku-Dateien
    const response = await fetch('/sudokus');
    const jsonFiles = await response.json();

    jsonFiles.forEach(file => {
        const option = document.createElement("option");
        option.value = file;
        option.textContent = file;
        sudokuSelect.appendChild(option);
    });

    // Sudoku laden
    loadSudokuButton.addEventListener("click", async () => {
        const selectedFile = sudokuSelect.value;
        if (selectedFile) {
            const sudokuResponse = await fetch(`/sudokus/${selectedFile}`);
            currentSudoku = await sudokuResponse.json();
            displaySudoku(currentSudoku);
        }
    });

    // Sudoku anzeigen
    function displaySudoku(sudoku) {
        sudokuGrid.innerHTML = ''; // Leere das Grid
        sudoku.forEach(row => {
            row.forEach(value => {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.textContent = value !== 0 ? value : ''; // Zeige nur die Zahlen an, leere Zellen bleiben leer
                sudokuGrid.appendChild(cell);
            });
        });
    }

    // Prüfen, ob eine Zahl im aktuellen Feld platziert werden kann
    function isValid(sudoku, row, col, num) {
        // Zeile prüfen
        for (let x = 0; x < 9; x++) {
            if (sudoku[row][x] === num) return false;
        }
        // Spalte prüfen
        for (let x = 0; x < 9; x++) {
            if (sudoku[x][col] === num) return false;
        }
        // 3x3 Box prüfen
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (sudoku[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    // Backtracking-Algorithmus zum Lösen des Sudokus
    function solveSudoku(sudoku) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudoku[row][col] === 0) { // Leeres Feld
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(sudoku, row, col, num)) {
                            sudoku[row][col] = num;
                            if (solveSudoku(sudoku)) return true; // Rekursive Lösung
                            sudoku[row][col] = 0; // Backtracking
                        }
                    }
                    return false; // Keine Lösung möglich
                }
            }
        }
        return true; // Sudoku gelöst
    }

    // Button zum Lösen des Sudokus
    solveSudokuButton.addEventListener("click", () => {
        if (currentSudoku) {
            if (solveSudoku(currentSudoku)) {
                displaySudoku(currentSudoku);
            } else {
                alert("Dieses Sudoku kann nicht gelöst werden.");
            }
        }
    });
});

let recursionDepth = 0; // Variable für Rekursionstiefe

// Funktion zum Lösen des Sudokus
function solveSudoku(grid) {
    let emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        return true; // Sudoku gelöst
    }
    
    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num; // Zahl setzen
            recursionDepth++; // Rekursionstiefe erhöhen

            if (solveSudoku(grid)) {
                return true;
            }

            grid[row][col] = 0; // Rückgängig machen
        }
    }

    return false; // Keine Lösung gefunden
}

// Funktion zum Rendern des Sudoku-Gitters
function renderSudoku(grid, originalGrid) {
    const sudokuGrid = document.getElementById('sudokuGrid');
    sudokuGrid.innerHTML = ''; // Vorherige Inhalte löschen

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (originalGrid[row][col] !== 0) {
                cell.textContent = originalGrid[row][col]; // Vorhandene Zahlen anzeigen
                cell.style.color = 'black'; // Vorhandene Zahlen in schwarz
            } else if (grid[row][col] !== 0) {
                cell.textContent = grid[row][col]; // Gelöste Zahlen anzeigen
                cell.style.color = 'red'; // Gelöste Zahlen in rot
            } else {
                cell.textContent = ''; // Leere Zelle
            }
            sudokuGrid.appendChild(cell);
        }
    }
}

// Funktion zum Suchen einer leeren Zelle
function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return [row, col]; // Rückgabe der ersten leeren Zelle
            }
        }
    }
    return null; // Keine leeren Zellen gefunden
}

// Funktion zur Überprüfung, ob eine Zahl an einer bestimmten Position gültig ist
function isValidPlacement(grid, row, col, num) {
    // Überprüfung der Zeile
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num) {
            return false;
        }
    }

    // Überprüfung der Spalte
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) {
            return false;
        }
    }

    // Überprüfung des 3x3-Blocks
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
        for (let j = boxColStart; j < boxColStart + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }

    return true; // Platzierung gültig
}

// Funktion, um das Sudoku zu laden
function loadSudoku(sudoku) {
    recursionDepth = 0; // Zurücksetzen der Rekursionstiefe
    const grid = JSON.parse(JSON.stringify(sudoku)); // Kopie des Sudoku zum Lösen
    renderSudoku(grid, sudoku); // Rendern mit Originalgrid
}

// Funktion zur Aktualisierung der Anzeige der Rekursionstiefe
function updateRecursionDepthDisplay() {
    const depthDisplay = document.getElementById('recursionDepthDisplay');
    depthDisplay.textContent = `Rekursionstiefe: ${recursionDepth}`;
}

// Funktion zum Lösen und Anzeigen des Sudokus
function solveSudokuAndDisplay() {
    const grid = getSudokuGrid(); // Funktion, die das aktuelle Sudoku-Gitter zurückgibt
    const originalGrid = JSON.parse(JSON.stringify(grid)); // Originalgrid speichern
    if (solveSudoku(grid)) {
        renderSudoku(grid, originalGrid); // Aktualisiere das Sudoku-Gitter
        updateRecursionDepthDisplay(); // Aktualisiere die Rekursionstiefe
    }
}

// Event Listener für den Button
document.getElementById('solveSudoku').addEventListener('click', () => {
    solveSudokuAndDisplay(); // Löse das Sudoku und aktualisiere die Rekursionstiefe
});

// Funktion zum Abrufen des aktuellen Sudoku-Gitters
function getSudokuGrid() {
    const grid = [];
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            const cellValue = parseInt(cells[i * 9 + j].textContent) || 0; // Wert der Zelle
            grid[i][j] = cellValue;
        }
    }
    return grid;
}

// Initialisiere die Auswahl des Sudokus
function initializeSudokuSelection() {
    fetch('/api/sudokus')
        .then(response => response.json())
        .then(sudokuFiles => {
            const sudokuSelect = document.getElementById('sudokuSelect');
            sudokuFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                sudokuSelect.appendChild(option);
            });
        });

    document.getElementById('sudokuSelect').addEventListener('change', (event) => {
        const selectedFile = event.target.value;
        if (selectedFile) {
            fetch(`/api/sudoku/${selectedFile}`)
                .then(response => response.json())
                .then(sudoku => loadSudoku(sudoku));
        }
    });
}

// Initialisiere das Dropdown bei Seitenladung
window.onload = initializeSudokuSelection;

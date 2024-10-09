const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

app.get('/api/sudokus', (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, '../beispiele'));
    const sudokuFiles = files.filter(file => file.endsWith('.json'));
    res.json(sudokuFiles);
});

app.get('/api/sudoku/:name', (req, res) => {
    const filePath = path.join(__dirname, '../beispiele', req.params.name);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Sudoku not found');
        }
        res.json(JSON.parse(data));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

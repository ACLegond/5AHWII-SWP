const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware zum Parsen von JSON-Daten
app.use(express.json());

// Statische Dateien aus dem Frontend-Ordner bereitstellen
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint zum Abrufen der Sudoku-Dateien
app.get('/sudokus', (req, res) => {
    fs.readdir(path.join(__dirname, '../beispiele'), (err, files) => {
        if (err) return res.status(500).send(err);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        res.json(jsonFiles);
    });
});

// Endpoint zum Abrufen eines bestimmten Sudokus
app.get('/sudokus/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../beispiele', req.params.filename);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).send(err);
        res.json(JSON.parse(data));
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

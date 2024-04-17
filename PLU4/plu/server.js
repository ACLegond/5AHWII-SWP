// server.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.get('/zoos', async (req, res) => {
    try {
        const zoos = await prisma.zoo.findMany();
        res.json(zoos);
    } catch (error) {
        console.error('Error fetching zoos:', error);
        res.status(500).json({ error: 'Error fetching zoos' });
    }
});

app.get('/zoos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const zoo = await prisma.zoo.findUnique({ where: { id } });
        if (!zoo) {
            res.status(404).json({ error: 'Zoo not found' });
            return;
        }
        res.json(zoo);
    } catch (error) {
        console.error(`Error fetching zoo with ID ${id}:`, error);
        res.status(500).json({ error: `Error fetching zoo with ID ${id}` });
    }
});

// Füge weitere Routen für andere Abfragen hinzu...

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

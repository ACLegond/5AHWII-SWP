const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Middleware to enable CORS

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/zoo', async (req, res) => {
    try {
        const zoos = await prisma.zoo.findMany();
        res.json(zoos);
    } catch (error) {
        console.error('Error fetching zoos:', error);
        res.status(500).json({ error: 'Error fetching zoos' });
    }
});

app.get('/zoo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const zo = await prisma.zoo.findUnique({ where: { id } });
        if (!zoo) {
            res.status(404).json({ error: 'Zoo not found' });
            return res.render('details', {zoo: zo});
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

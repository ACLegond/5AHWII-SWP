const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';
const prisma = require('./lib/db');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/', express.static('static'));

app.get('/', async (req, res) => {
    const zoos = await prisma.zoo.findMany();
    res.render('index', { zoos: zoos });
});

app.get('/zoo/:id', async (req, res) => {
    const id = req.params.id;
    const zoo = await prisma.zoo.findUnique({
        where: { id: id },
        include: {
            abteilungen: { select: { name: true } }
        }
    });
  
    if (req.headers['hx-request'] === 'true') {
        return res.render('details', { zoo: zoo });
    }
    res.render('details', { zoo: zoo });
});

//RouteZooadd
app.post('/addzoo', async (req, res) => {
    const { land, stadt, adresse, baujahr } = req.body;
    try {
      
        await prisma.zoo.create({
            data: {
                land: land,
                stadt: stadt,
                adresse: adresse,
                baujahr: parseInt(baujahr) 
            }
        });
        res.send('Zoo erfolgreich hinzugefügt');
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Zoos:', error);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

//RouteAbteilungadd
app.post('/zoo/:id/addAbteilung', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    try {
        await prisma.abteilung.create({
            data: {
                name: name,
                zooId: id
            }
        });
        const zoo = await prisma.zoo.findUnique({
            where: { id: id },
            include: {
                abteilungen: { select: { name: true } }
            }
        });
        res.render('partials/abteilungen', { zoo: zoo });
    } catch (error) {
        console.error('Fehler beim Hinzufügen der Abteilung:', error);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

//RouteAbteilungdelete
app.post('/zoo/:id/removeAbteilung', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    try {
        await prisma.abteilung.deleteMany({
            where: {
                name: name,
                zooId: id
            }
        });
        const zoo = await prisma.zoo.findUnique({
            where: { id: id },
            include: {
                abteilungen: { select: { name: true } }
            }
        });
        res.render('partials/abteilungen', { zoo: zoo });
    } catch (error) {
        console.error('Fehler beim Entfernen der Abteilung:', error);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});


// Server starten
app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});

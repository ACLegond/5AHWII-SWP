const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', async(req, res)=>{
    res.render("html", {zoos: await prisma.zoo.findMany() });
});

app.get('/zoo/:id', async(req, res) => {
    const id = req.params.id;
    const z = await prisma.zoo.findUnique({
        where: {id: id},
        include: {
            abteilungen: {select: {name: true}}
        }
    });
    return res.render('details', {zoo: z});
});

app.get('/htmx/', (req, res, next) => {
    if (req.originalUrl.endsWith('/')) return res.redirect('/htmx');
    next();
});

app.get('/htmx', (req, res) => {
    res.render('htmx');
});

app.post('/htmx-click', (req, res) => {
    res.render('htmx-click');
});

app.listen(3000);



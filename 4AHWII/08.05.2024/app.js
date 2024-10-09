const express = require('express');
const app = express();
const port = 3000;

app.get('/get-time', (req, res) => {
    const now = new Date();
    const time = {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
    };
    res.json(time);
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

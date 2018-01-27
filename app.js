const express = require('express')
const app = express()
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('No index.html found'));

app.listen(8080, () => console.log('Serving on port 8080!'));

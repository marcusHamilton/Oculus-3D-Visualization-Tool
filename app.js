const express = require('express')
const app = express()
var path = require('path');

//Manage GET requests

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res){
  res.send('index.html');
});

app.get('/localLoad', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/LocalLoad.html'));
});

app.get('/urlLoad', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/UrlLoad.html'));
});

app.get('/features', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/features.html'));
});

app.get('/about', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/aboutUs.html'));
});

app.get('/VR', function(req, res){
  res.sendFile(path.join(__dirname+'/public/html/virtualSpace.html'));
});

//End: Manage GET requests

app.listen(8080, () => console.log('Serving on port 8080!'));

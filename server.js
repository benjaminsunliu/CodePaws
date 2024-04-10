const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

app.use(
    express.json(),
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', {activePage: 'Home'});
});
app.get('/pets', function(req, res) {
    res.render('pets', {activePage: 'Pets'});
});
app.get('/find', function(req, res) {
    res.render('find', {activePage: 'Find'});
});
app.get('/dogcare', function(req, res) {
    res.render('dogcare', {activePage: 'Dogcare'});
});
app.get('/catcare', function(req, res) {
    res.render('catcare', {activePage: 'Catcare'});
});
app.get('/give', function(req, res) {
    res.render('give', {activePage: 'Give'});
});
app.get('/contact', function(req, res) {
    res.render('contact', {activePage: 'Contact'});
});
app.get('/disclaimer', function(req, res) {
    res.render('disclaimer', {activePage: 'Disclaimer'});
});



app.listen(3000, () => console.log('Server running on port 3000'));

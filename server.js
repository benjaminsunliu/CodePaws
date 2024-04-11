const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 5050;

app.set('view engine', 'ejs');

app.use(
    express.json(),
    express.urlencoded({
        extended: true,
    })
);
app.use(session({
    secret: 'your secret key', // A secret key used to sign the session ID cookie
    resave: false,             // Forces the session to be saved back to the session store
    saveUninitialized: true,   // Forces a session that is "uninitialized" to be saved to the store
    cookie: { secure: false }   // Use 'true' for HTTPS. 'false' is okay for HTTP
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index', {activePage: 'Home', loggedUser: req.session.username});
});
app.get('/create', function(req, res) {
    res.render('create', {activePage: 'Create', usernameError: null, passwordError: null, created: false, loggedUser: req.session.username});
});
app.get('/find', function(req, res) {
    res.render('find', {activePage: 'Find', loggedUser: req.session.username});
});
app.get('/dogcare', function(req, res) {
    res.render('dogcare', {activePage: 'Dogcare', loggedUser: req.session.username});
});
app.get('/catcare', function(req, res) {
    res.render('catcare', {activePage: 'Catcare', loggedUser: req.session.username});
});
app.get('/login', function(req, res) {
    res.render('login', {activePage: 'Give', loginError: null, loggedUser: req.session.username});
});
app.get('/give', function(req, res) {
    res.render('give', {activePage: 'Give', loggedUser: req.session.username});
});
app.get('/contact', function(req, res) {
    res.render('contact', {activePage: 'Contact', loggedUser: req.session.username});
});
app.get('/disclaimer', function(req, res) {
    res.render('disclaimer', {activePage: 'Disclaimer', loggedUser: req.session.username});
});

const loginFilePath = path.join(__dirname, 'data', 'login.txt');


app.post('/new', (req, res) => {
    const { username, password} = req.body;
    let usernameError = null, passwordError = null;

    // Validate the form data
    if (!/^[A-Za-z0-9]+$/.test(username)) {
        usernameError = 'Username can only contain letters and numbers.';
    }
    if (password.length < 4) {
        passwordError = 'Password must be at least 4 characters long.';
    }

    // Check if there were any errors
    if (usernameError || passwordError) {
        res.render('create', {activePage: 'Create', usernameError, passwordError, created: false, loggedUser: req.session.username});
    } else {
        // Process the form (e.g., save to database) and redirect or render success message
        //check if username already exists
        const loginData = fs.readFileSync(loginFilePath, 'utf8');
        const users = loginData.split('\n');
        const userExists = users.some(user => {
            const [fileUsername] = user.split(':');
            return fileUsername === username;
        });

        if (userExists) {
            res.render('create', {activePage: 'Create', usernameError: 'Username already exists.', passwordError: null, created: false, loggedUser: req.session.username});
        }
        else{
            fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
            res.render('create', {activePage: 'Create', usernameError: null, passwordError: null, created: true, loggedUser: req.session.username});
        }
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const loginData = fs.readFileSync(loginFilePath, 'utf8');
    const users = loginData.split('\n');
    const isValidUser = users.some(user => {
        const [fileUsername, filePassword] = user.split(':');
        return fileUsername === username && filePassword === password;
    });


    if (isValidUser) {
        // Here, you would typically start a session
        req.session.username = username;
        res.render('give', {activePage: 'Give', loggedUser: req.session.username, loginError: null});
    } else {
        res.render('login', {activePage: 'Give', loginError: 'Invalid username or password.', loggedUser: req.session.username});
    }
});
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy();
    res.redirect('/');
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

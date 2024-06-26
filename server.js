const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
const PORT = 5050;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
});
redisClient.connect().catch(error => {
    console.error('Failed to connect to Redis:', error);
});

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(
    express.json(),
    express.urlencoded({
        extended: true,
    })
);
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/petImages');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', function(req, res) {
    res.render('index', {activePage: 'Home', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the home page.`)
});
app.get('/create', function(req, res) {
    res.render('create', {activePage: 'Create', usernameError: null, passwordError: null, created: false, loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the create page.`)
});
app.get('/find', function(req, res) {
    res.render('find', {activePage: 'Find', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the find page.`)
});
app.get('/dogcare', function(req, res) {
    res.render('dogcare', {activePage: 'Dogcare', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the dogcare page.`)
});
app.get('/catcare', function(req, res) {
    res.render('catcare', {activePage: 'Catcare', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the catcare page.`)
});
app.get('/login', function(req, res) {
    if(req.session.username){
        res.render('give', {activePage: 'Give', loggedUser: req.session.username, giveSuccess: null});
        console.log(`User "${req.session.username}" is already logged in. Redirecting to /give.`)
    }
    else {
        res.render('login', {activePage: 'Give', loginError: null, loggedUser: req.session.username});
        console.log(`User "${req.session.username}" is on the login page.`)
    }
});
app.get('/give', function(req, res) {
    if(!req.session.username){
        res.redirect('/login');
        console.log("User requested /give without logging in. Redirecting to /login.")
    }
    else{
        res.render('give', {activePage: 'Give', loggedUser: req.session.username, giveSuccess: null});
        console.log(`User "${req.session.username}" is on the give page.`)
    }
});
app.get('/contact', function(req, res) {
    res.render('contact', {activePage: 'Contact', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the contact page.`)
});
app.get('/disclaimer', function(req, res) {
    res.render('disclaimer', {activePage: 'Disclaimer', loggedUser: req.session.username});
    console.log(`User "${req.session.username}" is on the disclaimer page.`)
});

const loginFilePath = path.join(__dirname, 'data', 'login.txt');


app.post('/new', async (req, res) => {
    const { username, password } = req.body;
    let usernameError = null, passwordError = null;

    // Validate the form data
    if (!/^[A-Za-z0-9]+$/.test(username)) {
        usernameError = 'Username can only contain letters and numbers.';
    }
    if (password.length < 4) {
        passwordError = 'Password must be at least 4 characters long.';
    }
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)){
        passwordError = 'Password must contain at least 1 digit and 1 letter.';
    }

    // Check if there were any errors
    if (usernameError || passwordError) {
        res.render('create', {activePage: 'Create', usernameError, passwordError, created: false, loggedUser: req.session.username});
    } else {
        // Check if username already exists in the database
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                console.log(`Username "${username}" already exists.`);
                res.render('create', {activePage: 'Create', usernameError: 'Username already exists.', passwordError: null, created: false, loggedUser: req.session.username});
            } else {
                // Create and save the new user
                const newUser = new User({ username, password });
                await newUser.save();
                console.log(`New user created: ${username}`);
                res.render('create', {activePage: 'Create', usernameError: null, passwordError: null, created: true, loggedUser: req.session.username});
            }
        } catch (error) {
            console.error('Error registering new user:', error);
            res.status(500).send('Error registering new user.');
        }
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            // Directly compare the plaintext passwords
            if (password === user.password) {
                req.session.username = username;
                req.session.save(() => {
                    console.log(`New Session from "${req.session.username}"`); // Log the session
                    res.render('give', {activePage: 'Give', loggedUser: req.session.username, loginError: null, giveSuccess: null});
                });
            } else {
                console.log(`Invalid password for username: ${username}`);
                res.render('login', {activePage: 'Give', loginError: 'Invalid username or password.', loggedUser: null});
            }
        } else {
            console.log(`Username not found: ${username}`);
            res.render('login', {activePage: 'Give', loginError: 'Invalid username or password.', loggedUser: null});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/logout', (req, res) => {
    if (!req.session.username) {
        res.render('login', {activePage: 'Give', loginError: "You are not logged in.", loggedUser: req.session.username})
        console.log("User requested /logout without logging in. Redirecting to /login.")
    }
    else {
        // Destroy the session
        console.log(`User "${req.session.username}" logged out.`)
        req.session.destroy();
        res.render('login', {activePage: 'Give', loginError: "You have logged out successfully.", loggedUser: null});
    }

});

app.post('/submit-pet', upload.single('image'), (req, res) => {
    // Extract form data from request body
    console.log(`User "${req.session.username}" submitted a pet.`)
    const { type, givebreed, age, gender, getalongdog, getalongcat, getalongchildren, comments, name, email } = req.body;
    const image = req.file ? `/petImages/${req.file.originalname}` : '/images/codepawsnobg.png';
    console.log(req.file ? `Image uploaded: ${req.file.originalname}` : 'No image uploaded');
    // Read existing pet data from file
    const petDataFilePath = path.join(__dirname, 'data', 'pets.txt');
    let petData = '';
    let newId = 1;
    if (fs.existsSync(petDataFilePath)) {
        petData = fs.readFileSync(petDataFilePath, 'utf8');
        if (petData) {
            // Generate new pet ID
            const petLines = petData.split('\n');
            const lastLine = petLines[petLines.length - 2]; // -2 because the last line is empty
            const lastId = parseInt(lastLine.split('|')[0]);
            newId = lastId + 1;
        }
    }

    // Format new pet data
    const newPetData = `${newId}|${req.session.username}|${type}|${givebreed}|${age}|${gender}|${getalongdog}|${getalongcat}|${getalongchildren}|${comments}|${name}|${email}|${image}\n`;

    // Append new pet data to file
    fs.appendFileSync(petDataFilePath, newPetData);

    // Send response
    res.render('give', {activePage: 'Give', loggedUser: req.session.username, giveSuccess: "Pet submitted successfully!"});
});

app.post('/find-pet', (req, res) => {
    console.log(`User "${req.session.username}" searched for a pet.`)
    const { type, breed, age, gender, getalongdog, getalongcat, getalongchildren } = req.body;

    const petDataFilePath = path.join(__dirname, 'data', 'pets.txt');
    const petData = fs.readFileSync(petDataFilePath, 'utf8').trim();

    const petLines = petData.split('\n');

    const filteredPets = petLines.filter(line => {
        const [num, username, petType, petBreed, petAge, petGender, petGetAlongDog, petGetAlongCat, petGetAlongChildren, petImage] = line.split('|');

        const matchesType = petType === type;
        const matchesBreed = breed === 'na' || petBreed === breed;
        const matchesAge = age === 'na' || petAge === age;
        const matchesGender = gender === 'na' || petGender === gender;
        const matchesDog = getalongdog === undefined || petGetAlongDog === getalongdog;
        const matchesCat = getalongcat === undefined || petGetAlongCat === getalongcat;
        const matchesChildren = getalongchildren === undefined || petGetAlongChildren === getalongchildren;
        const matchImage = petImage !== undefined;

        return matchesType && matchesBreed && matchesAge && matchesGender && matchesDog && matchesCat && matchesChildren && matchImage;
    });

    // Now, we need to parse each line into an object for easier use in EJS
    const pets = filteredPets.map(line => {
        const [num, username, petType, petBreed, petAge, petGender, petGetAlongDog, petGetAlongCat, petGetAlongChildren, comments, name, email, petImage] = line.split('|');
        return { num, username, petType, petBreed, petAge, petGender, petGetAlongDog, petGetAlongCat, petGetAlongChildren, comments, name, email, petImage}
    });

    res.render('pets', { activePage: 'Find', pets, loggedUser: req.session.username });
});

app.get("/allPets", (req, res) => {
    const petDataFilePath = path.join(__dirname, 'data', 'pets.txt');
    const petData = fs.readFileSync(petDataFilePath, 'utf8').trim();

    const petLines = petData.split('\n');

    const pets = petLines.map(line => {
        const [num, username, petType, petBreed, petAge, petGender, petGetAlongDog, petGetAlongCat, petGetAlongChildren, comments, name, email, petImage] = line.split('|');
        return { num, username, petType, petBreed, petAge, petGender, petGetAlongDog, petGetAlongCat, petGetAlongChildren, comments, name, email, petImage}
    });
    console.log(`User "${req.session.username}" is viewing all pets.`);
    res.render('pets', { activePage: 'Find', pets, loggedUser: req.session.username });
});

let logs = [];
let oldLog = console.log;
console.log = function(message) {
    logs.push(message);
    oldLog.apply(console, arguments);
};
app.get('/logs', function(req, res) {
    let logsJoined= logs.join('<br>');
    if(req.session.username === "admin"){
        res.send(logsJoined);
    }
    else{
        res.send("You are not authorized to view the logs.");
    }
});

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;

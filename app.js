// Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const moment = require('moment');

// Config Files
const favicon = require('./config/favicon');
var dbConnection = require("./config/connection.js");


// Initialize App
dotenv.config();
const app = express();
const port = process.env.PORT || 6890;


// Set View Engine
app.set('view engine', 'ejs');
app.locals.moment = moment;


// Middleware cookies, sessions, body-parser
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'Q!8m@3-U#5x%2-I&7k*9-C$4r^6-K(1v)8-S+2p_7-C=9n!3-A{6h}4-N[0y]5',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));


// Set favicon & Pagination
favicon(app);


// Static Files
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/font', express.static(__dirname + '/public/font'));
app.use('/js', express.static(__dirname + '/public/js'));


// Routes
app.use('/', require('./routes/MainRoutes'));



// Start Server
dbConnection.connect().then(() => {
    http.createServer(app).listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`🌐 http://localhost:${port}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server. DB connection error:", err);
    process.exit(1);
});
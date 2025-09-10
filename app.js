// Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const moment = require('moment');
const flash = require('connect-flash');



// Config Files
const favicon = require('./config/favicon');
var dbConnection = require("./config/connection.js");
const errorHandler = require("./middlewares/errorHandler.js");
const trackerMiddleware = require("./middlewares/UserTracker.js");


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

// Session middleware (must be before flash)
app.use(session({
    secret: process.env.SESSION_SECRET || 'Q!8m@3-U#5x%2-I&7k*9-C$4r^6-K(1v)8-S+2p_7-C=9n!3-A{6h}4-N[0y]5',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));

// Initialize flash messages & Error handler middleware & Set favicon & Pagination
app.use(flash());
favicon(app);


// Middleware to set user data in response locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Success flash messages
    res.locals.error = req.flash('error'); // Error flash messages
    next();
});


// Static Files
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/font', express.static(__dirname + '/public/font'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/qr-icon', express.static(__dirname + '/public/qr-icon'));




// Routes
app.use('/', require('./routes/MainRoutes'));


// Error handler middleware (must be last)
app.use((err, req, res, next) => errorHandler.handleError(err, req, res, next));


// Start Server
dbConnection.connect().then(() => {
    app.use(trackerMiddleware.analyzer);
    http.createServer(app).listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`🌐 http://localhost:${port}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server. DB connection error:", err);
    process.exit(1);
});
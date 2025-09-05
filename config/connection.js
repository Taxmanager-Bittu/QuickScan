// Npm Packages
const mongoose = require('mongoose');
const config = require('./config.json');

// Mongoose Configuration
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);


// Connection Class
class Connection {

    // Singleton Pattern
    constructor() {
        this.connectionEstablished = false;
    }

    // Connect Method
    async connect() {
        // Prevent multiple connections
        if (this.connectionEstablished) {
            console.log("🔁 MongoDB already connected.");
            return;
        }

        try {
            // Determine environment and select appropriate DB URI
            const host = config.hosts || 'localhost';
            const isDevelopmentHost = config.hosts.includes(host);

            // Use different URIs based on environment
            const dbURI = isDevelopmentHost ?
                config.MongoDB.Production.UrlLink :
                config.MongoDB.Development.UrlLink;

            await mongoose.connect(dbURI); // Clean, no deprecated options
            this.connectionEstablished = true;
            console.log("✅ MongoDB connected successfully.");

        } catch (error) {
            console.error("❌ MongoDB connection error:", error.message);
            throw error; // Let app.js handle this
        }
    }
}

module.exports = new Connection();
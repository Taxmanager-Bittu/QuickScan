// File and Functions import 
const logger = require("../utils/logger");




// class Error Handler
class ErrorHandler {
    constructor() {
        this.logger = logger; // Initialize logger instance
    }

    // Main error handling function
    handleError(err, req, res, next) {
        try {

            // Log the error (console + file + DB)
            this.logger.error(err.message, req);

            // Set a user-friendly flash message
            req.flash("error", "Something went wrong. Please try again later.");

            // Redirect user to the error page
            res.status(500).redirect("/error_404");

        } catch (error) {
            // In case error occurs inside the error handler itself
            console.error("ErrorHandler failed:", error);
            res.status(500).send("Unexpected error occurred.");
        }
    }
}

// Export a single instance of ErrorHandler
module.exports = new ErrorHandler();
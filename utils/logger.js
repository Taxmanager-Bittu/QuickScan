// NPM Packages
const fs = require("fs");
const path = require("path");

// Controller to save logs in DB
const ErrorHandlerlog = require("../controllers/log/errorHandlerControllers");


// clas 
class Logger {


    // constructor
    constructor() {
        // Initialize DB logger controller
        this.errorlog = new ErrorHandlerlog();

        // Setup log directory path
        this.logDirectory = path.join(__dirname, "../logs");

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
    }

    // Get current date in IST (India Standard Time) format YYYY-MM-DD
    // Used for daily log files
    getCurrentDateIST() {
        return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    }

    // Get general log file path
    getGeneralLogFilePath() {
        return path.join(this.logDirectory, `${this.getCurrentDateIST()}-general.log`);
    }

    // Get error log file path
    getErrorLogFilePath() {
        return path.join(this.logDirectory, `${this.getCurrentDateIST()}-error.log`);
    }

    // Core logging function
    // level: INFO, DEBUG, ERROR
    // message: string to log
    // filePath: file to store the log
    // req: request object to get client IP
    safeLog(level, message, filePath, req) {
        try {
            // Timestamp in IST
            const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

            // Get client IP if request object is available
            const clientIp = req ? req.ip || "Unknown IP" : "Unknown IP";

            // Extract file name and line number from stack trace
            let lineNumber = "N/A";
            let fileName = "N/A";
            const stack = new Error().stack;
            const match = stack.split("\n")[2].match(/\((.*):(\d+):(\d+)\)/);
            if (match) {
                fileName = match[1];
                lineNumber = match[2];
            }

            // Format log message
            const logMessage = `${timestamp} [${level}] File: ${fileName} Line: ${lineNumber} IP: ${clientIp} - ${message}\n`;

            // Write log to file asynchronously
            fs.appendFile(filePath, logMessage, (err) => {
                if (err) console.error("Logger file write error:", err);
            });

            // Print to console
            if (level === "ERROR") {
                console.error(logMessage);
            } else {
                console.log(logMessage);
            }

            // Save log to DB
            const dbLogMessage = {
                status: level,
                message: message,
                date: timestamp,
                clientIp: clientIp,
                fileName: fileName,
                lineNumber: lineNumber
            };

            this.errorlog.errorlogData(dbLogMessage, (response) => {
                if (response.Status === "ok") {
                    console.log("Log Saved to DB Successfully!");
                } else {
                    console.error("❌ DB Log Error:", response.Msg);
                }
            });

        } catch (err) {
            console.error(`Logger failed: ${err.message}`);
        }
    }

    // Log info level message
    info(message, req) {
        this.safeLog("INFO", message, this.getGeneralLogFilePath(), req);
    }

    // Log error level message
    error(message, req) {
        this.safeLog("ERROR", message, this.getErrorLogFilePath(), req);
    }

    // Log debug level message
    debug(message, req) {
        this.safeLog("DEBUG", message, this.getGeneralLogFilePath(), req);
    }

    // Log flash messages (success or error)
    flash(message, type = "INFO", req) {
        if (type === "ERROR") {
            req.flash("error", message);
            this.error(message, req);
        } else {
            req.flash("success", message);
            this.info(message, req);
        }
    }
}

// Export a single instance of Logger
module.exports = new Logger();
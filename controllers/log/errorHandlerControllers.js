// Express Route module import 
const uuid = require("uuid");

// File and Functions import 
const ErrorLogModel = require('../../models/ErrorHandlerModule');



// Class for All Functions
class errorLogApiData {

    // Save any log into ErrorLogModel 
    async errorlogData(logMessage, cb) {
        try {

            // Input Data
            const logId = uuid.v4().replace("-", "").substring(0, 12);
            const timestamp = logMessage.date ? new Date(logMessage.date) : new Date();

            // Determine status type
            let status = 'INFO'; // default
            if (logMessage.status) {
                const s = logMessage.status.toString().toUpperCase();
                if (['ERROR', 'INFO', 'DEBUG'].includes(s)) {
                    status = s;
                } else if (typeof logMessage.status === 'number' && logMessage.status >= 400) {
                    status = 'ERROR';
                }
            } else if (logMessage.errors && logMessage.errors.length > 0) {
                status = 'ERROR';
            }

            // Construct log object
            const logData = {
                logId,
                status, // ERROR / INFO / DEBUG
                message: logMessage.message || '',
                errors: logMessage.errors || [],
                data: logMessage.data || null,
                clientIp: logMessage.clientIp || 'Unknown IP',
                fileName: logMessage.fileName || 'Unknown File',
                lineNumber: logMessage.lineNumber || 'N/A',
                timestamp
            };

            // Save to MongoDB
            const savedLog = new ErrorLogModel(logData);
            await savedLog.save();

            // Print to console
            if (status === 'ERROR') {
                console.error(`❌ [${status}] ${logData.message} | File: ${logData.fileName} | Line: ${logData.lineNumber} | IP: ${logData.clientIp}`);
            } else if (status === 'DEBUG') {
                console.debug(`🐛 [${status}] ${logData.message}`);
            } else {
                console.log(`ℹ️ [${status}] ${logData.message}`);
            }

            // Callback with success
            return cb({ Status: 'ok', Msg: `Log saved as ${status}`, data: savedLog });

        } catch (error) {
            console.error("❌ Error in saving log:", error.message);
            return cb({ Status: 'fail', Msg: error.message });
        }
    }

}

// Export the module
module.exports = errorLogApiData;
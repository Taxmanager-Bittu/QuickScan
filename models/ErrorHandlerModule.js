// NPm Packages
const mongoose = require('mongoose');

// Schema
const errorHandlerSchema = new mongoose.Schema({
    logId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ERROR', 'INFO', 'DEBUG'],
        default: 'ERROR'
    },
    message: {
        type: String,
        required: true
    },
    errors: {
        type: Array,
        default: []
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    clientIp: {
        type: String,
        default: 'Unknown IP'
    },
    fileName: {
        type: String,
        default: 'Unknown File'
    },
    lineNumber: {
        type: String,
        default: 'N/A'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    suppressReservedKeysWarning: true
});


// Export File
const ErrorHandler = mongoose.model('ErrorHandler', errorHandlerSchema);
module.exports = ErrorHandler;
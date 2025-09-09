// Npm Packages
const mongoose = require("mongoose");

// Sub-schema for individual visits
const VisitSchema = new mongoose.Schema({
    sessionId: String,
    host: String,
    referrer: String,
    entryUrl: String,
    currentUrl: String,
    entryTime: {
        type: Date,
        default: Date.now
    },
    exitTime: Date,
    timeOnPageSeconds: {
        type: Number,
        default: 0
    },

    geo: {
        country: String,
        region: String,
        city: String,
        ll: [Number]
    },

    userAgent: {
        uaString: String,
        browser: String,
        version: String,
        os: String,
        osVersion: String,
        device: String,
        isMobile: Boolean,
        isTablet: Boolean,
        isDesktop: Boolean
    },

    clientInfo: {
        screen: {
            width: Number,
            height: Number
        },
        timezone: String,
        language: String
    },

    cookies: Object,
    headers: Object,
    isBot: Boolean,
    vpnSuspected: Boolean,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Main schema for visitor (grouped by IP)
const VisitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    }, // unique visitor by IP
    visits: {
        type: [VisitSchema],
        default: []
    } // multiple visits inside one IP
});

module.exports = mongoose.model("Visitor", VisitorSchema);
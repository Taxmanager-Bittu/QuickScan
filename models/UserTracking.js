// Npm Packages
const mongoose = require("mongoose");

// Sub-schema for GPS-based location
const GPSLocationSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    accuracy: String
}, {
    _id: false
});

// Sub-schema for IP-based location
const IPLocationSchema = new mongoose.Schema({
    range: [Number],
    country: String,
    region: String,
    eu: String,
    timezone: String,
    city: String,
    ll: [Number],
    metro: Number,
    area: Number
}, {
    _id: false
});

// Sub-schema for Current Location (IP + GPS)
const CurrentLocationSchema = new mongoose.Schema({
    ip: String,
    ipBased: IPLocationSchema,
    gpsBased: GPSLocationSchema
}, {
    _id: false
});

// Sub-schema for User Agent
const UserAgentInfoSchema = new mongoose.Schema({
    uaString: String,
    browser: String,
    version: String,
    os: String,
    osVersion: String,
    device: String,
    platform: String,
    source: String,
    isMobile: Boolean,
    isTablet: Boolean,
    isDesktop: Boolean,
    isAndroid: Boolean,
    isMac: Boolean
}, {
    _id: false
});

// Sub-schema for Client Info
const ClientInfoSchema = new mongoose.Schema({
    screen: {
        width: Number,
        height: Number
    },
    timezone: String,
    language: String
}, {
    _id: false
});

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

    // Location Info
    geo: IPLocationSchema,
    currentLocation: CurrentLocationSchema,

    // User Agent Info
    userAgent: UserAgentInfoSchema,

    // Client Info
    clientInfo: ClientInfoSchema,

    cookies: Object,
    headers: Object,

    // Flags
    isBot: Boolean,
    vpnSuspected: Boolean,

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});

// Main schema for visitor (grouped by IP or machineId)
const VisitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    visits: {
        type: [VisitSchema],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Visitor", VisitorSchema);
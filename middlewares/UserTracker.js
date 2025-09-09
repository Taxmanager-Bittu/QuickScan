// npm Packages
const requestIp = require("request-ip");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const { v4: uuidv4 } = require("uuid");

// File Import 
const TrackerController = require("../controllers/usertracking/TrackerController");


// File Object
const trackerCtrl = new TrackerController();



// Class For USer Tracking Funtion
class Tracker {


    constructor() {
        this.analyzer = this.analyzer.bind(this);
    }

    detectBot(ua) {
        if (!ua) return false;
        const low = ua.toLowerCase();
        return /(bot|crawler|spider|curl|wget|python|java|php|headless|scrapy)/.test(low);
    }

    vpnCheck(ip, geo) {
        if (!ip || !geo) return true;
        return /^(10\.|192\.168|127\.)/.test(ip);
    }

    async analyzer(req, res, next) {
        try {
            // session ID
            if (!req.session.sessionId) {
                req.session.sessionId = uuidv4();
            }

            const ip = requestIp.getClientIp(req) || req.ip || "Unknown";
            const uaString = req.headers["user-agent"] || "Unknown";
            const parser = new UAParser(uaString);
            const ua = parser.getResult();
            const geo = geoip.lookup(ip) || {};

            const data = {
                sessionId: req.session.sessionId,
                ip,
                host: req.hostname,
                referrer: req.get("referer") || "Direct",
                entryUrl: req.originalUrl,
                currentUrl: req.originalUrl,
                entryTime: new Date(),

                geo: {
                    country: geo.country || null,
                    region: geo.region || null,
                    city: geo.city || null,
                    ll: geo.ll || []
                },

                userAgent: {
                    uaString,
                    browser: ua.browser.name || null,
                    version: ua.browser.version || null,
                    os: ua.os.name || null,
                    osVersion: ua.os.version || null,
                    device: ua.device.type || "desktop",
                    isMobile: ua.device.type === "mobile",
                    isTablet: ua.device.type === "tablet",
                    isDesktop: !ua.device.type
                },

                clientInfo: {
                    screen: {},
                    timezone: null,
                    language: req.headers["accept-language"] || null
                },

                cookies: req.cookies || {},
                headers: {
                    "accept-language": req.headers["accept-language"],
                    "referer": req.headers["referer"]
                },

                isBot: this.detectBot(uaString),
                vpnSuspected: this.vpnCheck(ip, geo)
            };

            // save visitor data
            const trackinguser = await trackerCtrl.save(data);

            // on response finish -> exit time save
            res.on("finish", async() => {
                await trackerCtrl.updateExit(req.session.sessionId, req.originalUrl);
            });

            next();
        } catch (err) {
            console.error("❌ Tracker Middleware Error:", err);
            next();
        }
    }
}

module.exports = new Tracker();
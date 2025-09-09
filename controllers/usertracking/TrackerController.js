// File import
const Visitor = require("../../models/UserTracking");


// Tracker Controller 
class TrackerController {


    // Save or update visitor data
    async save(data) {
        try {
            // Find visitor by IP
            let visitor = await Visitor.findOne({ ip: data.ip });

            if (!visitor) {
                // Create new visitor if not found
                visitor = new Visitor({
                    ip: data.ip,
                    visits: []
                });
            }

            // Add new visit record to visits array
            visitor.visits.push({
                sessionId: data.sessionId,
                host: data.host,
                referrer: data.referrer,
                entryUrl: data.entryUrl,
                currentUrl: data.currentUrl,
                entryTime: data.entryTime || new Date(),
                exitTime: null,
                timeOnPageSeconds: 0,

                // Geo/IP location data
                geo: data.geo || {},

                // User agent details
                userAgent: {
                    uaString: data.userAgent.uaString,
                    browser: data.userAgent.browser,
                    version: data.userAgent.version,
                    os: data.userAgent.os,
                    osVersion: data.userAgent.osVersion,
                    device: data.userAgent.device,
                    isMobile: data.userAgent.isMobile,
                    isTablet: data.userAgent.isTablet,
                    isDesktop: data.userAgent.isDesktop
                },

                // Client info (screen, timezone, language)
                clientInfo: {
                    screen: data.clientInfo.screen || {},
                    timezone: data.clientInfo.timezone || null,
                    language: data.clientInfo.language || null
                },

                // Cookies data
                cookies: data.cookies || {},

                // HTTP headers
                headers: data.headers || {},

                // Bot and VPN flags
                isBot: data.isBot || false,
                vpnSuspected: data.vpnSuspected || false
            });

            // Save visitor document
            const savetracking = await visitor.save();
            return { status: "success" };

        } catch (err) {
            console.error("❌ Tracker Save Error:", err);
            return { status: "error", error: err.message };
        }
    }

    // Update exit time and time spent on page
    async updateExit(sessionId, url) {
        try {
            // Find visitor with matching sessionId and URL
            const visitor = await Visitor.findOne({
                "visits.sessionId": sessionId,
                "visits.currentUrl": url
            });

            if (visitor) {
                // Find specific visit record
                const visit = visitor.visits.find(
                    (v) => v.sessionId === sessionId && v.currentUrl === url
                );

                if (visit) {
                    // Set exit time
                    visit.exitTime = new Date();

                    // Calculate time spent in seconds
                    if (visit.entryTime) {
                        visit.timeOnPageSeconds = Math.round(
                            (visit.exitTime - visit.entryTime) / 1000
                        );
                    }
                }

                // Save updated visitor document
                await visitor.save();
            }
        } catch (err) {
            console.error("❌ Tracker Update Error:", err);
        }
    }

}

module.exports = TrackerController;
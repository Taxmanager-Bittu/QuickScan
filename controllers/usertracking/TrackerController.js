// File import
const Visitor = require("../../models/UserTracking");


// Tracker Controller 
class TrackerController {


    // Save or update visitor data.
    async save(data) {
        try {
            // Find visitor by IP
            let visitor = await Visitor.findOne({ ip: data.ip });

            if (!visitor) {
                // If no visitor exists for this IP, create new
                visitor = new Visitor({
                    ip: data.ip,
                    userAgent: data.userAgent,
                    visits: []
                });
            }

            // Add a new visit record inside the visits array
            visitor.visits.push({
                sessionId: data.sessionId,
                currentUrl: data.currentUrl,
                entryTime: data.entryTime || new Date(),
                exitTime: null,
                timeOnPageSeconds: 0
            });

            const savetracking = await visitor.save();
            console.log("🚀 ~ TrackerController ~ save ~ savetracking:", savetracking)
            return { status: "success" };

        } catch (err) {
            console.error("❌ Tracker Save Error:", err);
            return { status: "error", error: err.message };
        }
    }

    // Update exit time and calculate time spent on page. 
    async updateExit(sessionId, url) {
        try {
            // Find visitor that contains the given session + url
            const visitor = await Visitor.findOne({
                "visits.sessionId": sessionId,
                "visits.currentUrl": url
            });

            if (visitor) {
                // Find that specific visit inside the array
                const visit = visitor.visits.find(
                    (v) => v.sessionId === sessionId && v.currentUrl === url
                );

                if (visit) {
                    visit.exitTime = new Date();

                    if (visit.entryTime) {
                        visit.timeOnPageSeconds = Math.round(
                            (visit.exitTime - visit.entryTime) / 1000
                        );
                    }
                }

                await visitor.save();
            }
        } catch (err) {
            console.error("❌ Tracker Update Error:", err);
        }
    }
}

module.exports = TrackerController;
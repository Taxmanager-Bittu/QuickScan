// Express Rout module import 
var express = require('express');


// File and Functions import
class QrCodeGeneratorApiData {

    // save user agent data
    async HistoryData(data, UserTRackUID) {
        try {
            // Prepare request payload
            const LogsDetailsData = {
                UserId: data.User_id,
                EmailId: data.EmailId,
                UserType: data.UserType,

                // Add history/detail object
                DetailHistory: {
                    ip: UserTRackUID.ip || "blank",
                    mac: UserTRackUID.machineId.mac || "blank",
                    previousUrl: UserTRackUID.previousUrl || "blank",
                    currentUrl: UserTRackUID.currentUrl || "blank",
                    location: UserTRackUID.location ? JSON.stringify(UserTRackUID.location) : "blank",
                    currentLocation: UserTRackUID.currentLocation ? JSON.stringify(UserTRackUID.currentLocation) : "blank",
                    Browser: UserTRackUID.userAgentInfo.browser || "blank",
                    Version: UserTRackUID.userAgentInfo.version || "blank",
                    OS: UserTRackUID.userAgentInfo.os || "blank",
                    Platform: UserTRackUID.userAgentInfo.platform || "blank",
                    Source: UserTRackUID.userAgentInfo.source || "blank",
                    Is: Object.fromEntries(
                        Object.entries(UserTRackUID.userAgentInfo.is || {}).filter(([_, v]) => v === true)
                    )
                }
            };

            //Return Data
            return LogsDetailsData;

        } catch (error) {
            console.error("Error in login History Data:", error);
            return null;
        }
    }

    // Save qr Type
    async saveQrTypeData(req, res) {
        try {
            // 1. Input Data
            const data = req.body;

            // 2. Extract previous URL path
            const requestData = req.get("referer") || req.originalUrl;
            const urls = new URL(requestData, `${req.protocol}://${req.get("host")}`);
            const path = urls.pathname;

            // Final response data
            const resdata = {
                qr_type: data.qr_type || null,
                route_name: data.route_name || null,
                path: path || null,
                userId: "USR_" + Date.now()
            };

            // Retun Data
            return ({ Status: "suc", Msg: "QR type data saved successfully", data: resdata });

        } catch (error) {
            console.error("Error in save Qr Type Data:", error);
            return ({ Status: "err", Msg: "Something went wrong", error: error });
        }
    }

    // Save Complete Content
    async saveQrcontent(req, res) {
        try {
            // inout Data 
            const data = req.body;
            // 2. Extract previous URL path
            const requestData = req.get("referer") || req.originalUrl;
            const urls = new URL(requestData, `${req.protocol}://${req.get("host")}`);
            const path = urls.pathname;

            // Final response data
            const resdata = {
                qr_type: data.qr_type || null,
                route_name: data.route_name || null,
                path: path || null,
                userId: "USR_" + Date.now()
            };

            // Retun Data
            return ({ Status: "suc", Msg: "QR type data saved successfully", data: resdata });

        } catch (error) {
            console.error("Error in save Qr Type Data:", error);
            return ({ Status: "err", Msg: "Something went wrong", error: error });
        }
    }







}

// File and Functions import
module.exports = QrCodeGeneratorApiData;
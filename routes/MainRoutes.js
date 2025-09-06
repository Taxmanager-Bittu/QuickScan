// Express Route module import
const express = require("express");
const router = express.Router();
//
// File and Functions import
const qrgeneratorController = require("../controllers/qr-generator/Qr_Generator_Controllers")
const logger = require("../utils/logger");


// File canvert in object
const qrgenrat = new qrgeneratorController();







// Dashboard Page
router.get(["/"], async(req, res) => {
    try {
        // Pages Direcdtory
        return res.status(200).render("../views/main/index.ejs", {
            title: "Dashboard"
        });
    } catch (error) {
        next(error);
    }
});

// Save QR Code Type
router.post("/save-qr-type", async(req, res, next) => {
    try {
        // Call the Qr Type Function
        const response = await qrgenrat.saveQrTypeData(req, res);

        // Handle response and redirect accordingly
        if (response.Status === 'suc') {
            req.flash("success", "QR Code Type saved successfully.");
            return res.status(200).redirect(response.data.Path + "?Id=" + encodeURIComponent(response.data.userId) + "&Status=success");
        } else {
            req.flash("error", 'Failed to save QR Code Type. Try again.');
            return res.status(200).redirect(response.data.Path + "?ID=" + encodeURIComponent(response.data.userId) + "&Status=error");
        }
    } catch (error) {
        next(error);
    }
});





// Export the Route Functions
module.exports = router;
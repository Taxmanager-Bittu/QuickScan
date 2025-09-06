// Express Route module import
const express = require("express");
const router = express.Router();
//
// File and Functions import


// File canvert in object




// Dashboard Page
router.get(["/"], async(req, res) => {
    try {
        // Pages Direcdtory
        return res.status(200).render("../views/main/index.ejs", {
            title: "Dashboard"
        });
    } catch (error) {

    }
});



// Export the Route Functions
module.exports = router;
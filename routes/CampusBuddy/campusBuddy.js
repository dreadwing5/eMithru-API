const express = require("express");

const router = express.Router();
const campusBuddyController = require("../../controllers/CampusBuddy/campusBuddy");

router.post("/query", campusBuddyController.handleUserQuery);

module.exports = router;

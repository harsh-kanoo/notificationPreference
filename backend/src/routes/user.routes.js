const express = require("express");
const router = express.Router();
const {
  getProfile,
  updatePreferences,
  getNotifications,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/profile", authenticate, getProfile);
router.put("/preferences", authenticate, updatePreferences);
router.get("/notifications", authenticate, getNotifications);

module.exports = router;

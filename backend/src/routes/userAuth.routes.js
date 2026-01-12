const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getPushNotifications,
} = require("../controllers/userAuth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Auth
router.post("/signup", signup);
router.post("/login", login);

// Profile
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// Preferences
router.get("/preferences", authenticate, getPreferences);
router.put("/preferences", authenticate, updatePreferences);

// Push Notifications
router.get("/notifications/push", authenticate, getPushNotifications);

module.exports = router;

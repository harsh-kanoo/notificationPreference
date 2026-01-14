const express = require("express");
const router = express.Router();
const {
  getProfile,
  updatePreferences,
  getNotifications,
  placeOrder,
  getMyOrders,
  deleteNotification,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/profile", authenticate, getProfile);
router.put("/preferences", authenticate, updatePreferences);
router.get("/notifications", authenticate, getNotifications);
router.post("/place-order", authenticate, placeOrder);
router.get("/get-orders", authenticate, getMyOrders);
router.delete(
  "/notification/:userId/:campaignId",
  authenticate,
  deleteNotification
);

module.exports = router;

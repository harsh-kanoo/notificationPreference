const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        name: true,
        email: true,
        city: true,
        gender: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, city, gender, phone } = req.body;

    const updatedUser = await prisma.users.update({
      where: { user_id: req.user.user_id },
      data: { name, city, gender, phone },
    });

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

const getPreferences = async (req, res) => {
  try {
    const prefs = await prisma.preference.findUnique({
      where: { user_id: req.user.user_id },
    });
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching preferences" });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { offers, order_updates, newsletter } = req.body;

    const updated = await prisma.preference.update({
      where: { user_id: req.user.user_id },
      data: {
        offers,
        order_updates,
        newsletter,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ message: "Error updating preferences" });
  }
};

const getPushNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("Checking notifications for:", userId);

    const userPrefs = await prisma.preference.findUnique({
      where: { user_id: userId },
    });
    console.log("User Offers Pref:", userPrefs?.offers);

    const logs = await prisma.notification_logs.findMany({
      where: { user_id: userId, status: "SUCCESS" },
      include: { campaign: true },
      orderBy: { sent_at: "desc" },
    });
    console.log("Total logs found in DB:", logs.length);

    const pushOnly = logs.filter((log) => {
      const type = log.campaign.notification_type; // e.g., 'OFFER'
      if (type === "OFFER") return userPrefs.offers?.includes("PUSH");
      if (type === "ORDER_UPDATE")
        return userPrefs.order_updates?.includes("PUSH");
      if (type === "NEWSLETTER") return userPrefs.newsletter?.includes("PUSH");
      return false;
    });

    res.json(pushOnly);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getPushNotifications,
};

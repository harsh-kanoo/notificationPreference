const prisma = require("../config/prisma");

/* ---------- GET PROFILE ---------- */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        user_id: true,
        name: true,
        email: true,
        city: true,
        phone: true,
        preference: true,
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

/* ---------- UPDATE PREFERENCES ---------- */
const updatePreferences = async (req, res) => {
  try {
    const { offers, order_updates, newsletter } = req.body;

    const updatedPreference = await prisma.preference.update({
      where: { user_id: req.user.user_id },
      data: {
        offers,
        order_updates,
        newsletter,
      },
    });

    res.json({
      message: "Preferences updated successfully",
      data: updatedPreference,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};

/* ---------- GET NOTIFICATIONS ---------- */
const getNotifications = async (req, res) => {
  try {
    const logs = await prisma.notification_logs.findMany({
      where: { user_id: req.user.user_id },
      include: {
        campaign: {
          select: {
            campaign_name: true,
            notification_type: true,
          },
        },
      },
      orderBy: { sent_at: "desc" },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

module.exports = {
  getProfile,
  updatePreferences,
  getNotifications,
};

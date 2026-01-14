const prisma = require("../config/prisma");

const getUsersWithPreferences = async () => {
  const users = await prisma.users.findMany({
    where: { role: "CUSTOMER" },
    include: {
      preference: {
        select: {
          offers: true,
          order_updates: true,
          newsletter: true,
        },
      },
    },
  });

  return users.map((user) => ({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    gender: user.gender,
    is_active: user.is_active,

    preferences: {
      offers: user.preference?.offers ?? "OFF",
      order_updates: user.preference?.order_updates ?? "OFF",
      newsletter: user.preference?.newsletter ?? "OFF",
    },
  }));
};

const getAllCampaigns = async () => {
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      campaign_name: "asc",
    },
    include: {
      _count: {
        select: {
          notification_logs: true,
        },
      },
    },
  });

  return campaigns.map((c) => ({
    campaign_id: c.campaign_id,
    campaign_name: c.campaign_name,
    city_filter: c.city_filter,
    gender_filter: c.gender_filter,
    status: c.status,
    created_by: c.created_by,

    sent_count: c.status === "SENT" ? c._count.notification_logs : null,
  }));
};

const updateUserStatus = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.users.update({
    where: { user_id: userId },
    data: {
      is_active: !user.is_active,
    },
  });

  return updatedUser;
};

module.exports = {
  getUsersWithPreferences,
  getAllCampaigns,
  updateUserStatus,
};

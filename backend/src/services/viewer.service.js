const prisma = require("../config/prisma");

const getCampaigns = async () => {
  const campaigns = await prisma.campaign.findMany({
    include: {
      _count: {
        select: {
          notification_logs: true,
        },
      },
    },
    orderBy: {
      campaign_name: "asc",
    },
  });

  return campaigns.map((c) => ({
    campaign_id: c.campaign_id,
    campaign_name: c.campaign_name,
    city_filter: c.city_filter,
    gender_filter: c.gender_filter,
    status: c.status,
    sent_count: c.status === "SENT" ? c._count.notification_logs : null,
  }));
};

const getRecipientsCSV = async (campaignId) => {
  const logs = await prisma.notification_logs.findMany({
    where: {
      campaign_id: campaignId,
    },
    include: {
      users: {
        include: {
          preference: true,
        },
      },
    },
  });

  if (logs.length === 0) {
    throw new Error("No recipients found for this campaign");
  }

  const headers = [
    "name",
    "email",
    "phone",
    "city",
    "gender",
    "offers",
    "order_updates",
    "newsletter",
  ];

  const rows = logs.map(({ users }) => [
    users.name,
    users.email,
    users.phone,
    users.city,
    users.gender,
    users.preference?.offers || "OFF",
    users.preference?.order_updates || "OFF",
    users.preference?.newsletter || "OFF",
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
};

module.exports = {
  getCampaigns,
  getRecipientsCSV,
};

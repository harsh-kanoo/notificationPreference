const prisma = require("../config/prisma");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const csv = require("csvtojson");
const {
  isValidPreferenceValue,
  ALLOWED_CHANNELS,
} = require("../utils/preferenceValidator");

const bulkUploadUsers = async (csvString) => {
  const rows = await csv().fromString(csvString);

  const success = [];
  const failed = [];

  for (const row of rows) {
    try {
      const {
        name,
        email,
        password,
        phone,
        city,
        gender,
        offers,
        order_updates,
        newsletter,
      } = row;

      if (!name || !email || !password || !phone || !city || !gender) {
        throw new Error("Missing required fields");
      }

      if (
        !isValidPreferenceValue(offers) ||
        !isValidPreferenceValue(order_updates) ||
        !isValidPreferenceValue(newsletter)
      ) {
        throw new Error("Invalid preference format");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.create({
        data: {
          user_id: uuidv4(),
          name,
          email,
          password: hashedPassword,
          phone,
          city,
          gender,
          preference: {
            create: {
              preference_id: uuidv4(),
              offers,
              order_updates,
              newsletter,
            },
          },
        },
      });

      success.push(email);
    } catch (err) {
      failed.push({
        email: row.email,
        error: err.message,
      });
    }
  }

  return {
    total: rows.length,
    success: success.length,
    failed: failed.length,
    failed_rows: failed,
  };
};

const getPreferenceField = (notificationType) => {
  switch (notificationType) {
    case "OFFER":
      return "offers";
    case "ORDER_UPDATE":
      return "order_updates";
    case "NEWSLETTER":
      return "newsletter";
    default:
      throw new Error("Invalid notification type");
  }
};

const buildPreferenceFilter = (field) => ({
  is: {
    AND: [
      { [field]: { not: "OFF" } },
      {
        OR: ALLOWED_CHANNELS.map((ch) => ({
          [field]: { contains: ch },
        })),
      },
    ],
  },
});

const createNotificationLogs = async (campaign, tx) => {
  const preferenceField = "offers";

  const users = await tx.users.findMany({
    where: {
      is_active: true,

      ...(campaign.city_filter !== "NONE"
        ? { city: campaign.city_filter }
        : {}),

      ...(campaign.gender_filter !== "NONE"
        ? { gender: campaign.gender_filter }
        : {}),

      preference: buildPreferenceFilter(preferenceField),
    },
    select: { user_id: true },
  });

  if (!users.length) {
    console.log("No eligible users found for campaign", campaign.campaign_id);
    return;
  }

  await tx.notification_logs.createMany({
    data: users.map((u) => ({
      user_id: u.user_id,
      campaign_id: campaign.campaign_id,
      sent_at: new Date(),
      status: "SUCCESS",
    })),
    skipDuplicates: true,
  });

  console.log(`Notifications created for ${users.length} users`);
};

const createCampaign = async (creatorId, data) => {
  const status = data.status || "DRAFT";
  return prisma.campaign.create({
    data: {
      campaign_id: uuidv4(),
      campaign_name: data.campaign_name,
      city_filter: data.city_filter || "NONE",
      gender_filter: data.gender_filter,
      scheduled_at:
        data.status === "SCHEDULED" ? new Date(data.scheduled_at) : new Date(),
      status,
      created_by: creatorId,
    },
  });
};

const updateCampaign = async (creatorId, campaignId, data) => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.campaign.findUnique({
      where: { campaign_id: campaignId },
    });

    if (!existing) throw new Error("Campaign not found");
    if (existing.created_by !== creatorId) throw new Error("Unauthorized");
    if (existing.status === "SENT")
      throw new Error("Sent campaigns cannot be edited");

    return tx.campaign.update({
      where: { campaign_id: campaignId },
      data: {
        campaign_name: data.campaign_name,
        city_filter: data.city_filter,
        gender_filter: data.gender_filter,
        status: data.status,
        scheduled_at:
          data.status === "SCHEDULED" ? new Date(data.scheduled_at) : null,
      },
    });
  });
};

const getCreatorCampaigns = async (creatorId) => {
  return await prisma.campaign.findMany({
    where: {
      created_by: creatorId,
    },
    orderBy: {
      campaign_name: "asc",
    },
  });
};

module.exports = {
  bulkUploadUsers,
  createCampaign,
  updateCampaign,
  getCreatorCampaigns,
  getPreferenceField,
  buildPreferenceFilter,
  createNotificationLogs,
};

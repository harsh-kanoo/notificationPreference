const prisma = require("../config/prisma");

exports.getAllCampaigns = () => {
  return prisma.campaign.findMany({
    include: {
      staff: { select: { name: true, role: true } },
    },
  });
};

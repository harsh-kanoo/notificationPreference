const cron = require("node-cron");
const prisma = require("../config/prisma");
const { createNotificationLogs } = require("../services/creator.service");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "SCHEDULED",
      scheduled_at: { lte: now },
    },
  });

  for (const campaign of campaigns) {
    try {
      await prisma.$transaction(async (tx) => {
        // Send notifications (logs)
        await createNotificationLogs(campaign, tx);

        // Mark campaign as SENT
        await tx.campaign.update({
          where: { campaign_id: campaign.campaign_id },
          data: {
            status: "SENT",
            sent_at: new Date(),
          },
        });
      });

      console.log(` Campaign sent: ${campaign.campaign_id}`);
    } catch (err) {
      console.error(`Failed campaign ${campaign.campaign_id}`, err.message);
    }
  }
});

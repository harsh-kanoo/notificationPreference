const viewerService = require("../services/viewer.service");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await viewerService.getCampaigns();
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadCampaignRecipients = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const csvData = await viewerService.getRecipientsCSV(campaignId);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=campaign_${campaignId}_recipients.csv`
    );

    res.send(csvData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getCampaigns,
  downloadCampaignRecipients,
};

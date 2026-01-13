const creatorService = require("../services/creator.service");

const bulkUploadUsers = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const result = await creatorService.bulkUploadUsers(
      req.file.buffer.toString()
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await creatorService.createCampaign(
      req.user.staff_id,
      req.body
    );
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await creatorService.updateCampaign(
      req.user.staff_id,
      req.params.campaignId,
      req.body
    );
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

const getCreatorCampaigns = async (req, res) => {
  try {
    const campaigns = await creatorService.getCreatorCampaigns(
      req.user.staff_id
    );
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bulkUploadUsers,
  createCampaign,
  updateCampaign,
  getCreatorCampaigns,
};

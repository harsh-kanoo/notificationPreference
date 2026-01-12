const adminService = require("../services/admin.service");

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsersWithPreferences();
    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await adminService.getAllCampaigns();
    return res.status(200).json({
      count: campaigns.length,
      campaigns,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch campaigns",
      error: err.message,
    });
  }
};

module.exports = {
  getUsers,
  getCampaigns,
};

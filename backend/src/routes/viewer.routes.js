const router = require("express").Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const {
  getCampaigns,
  downloadCampaignRecipients,
} = require("../controllers/viewer.controller");

router.get("/campaigns", authenticate, authorize("VIEWER"), getCampaigns);

router.get(
  "/campaigns/:campaignId/recipients",
  authenticate,
  authorize("VIEWER"),
  downloadCampaignRecipients
);

module.exports = router;

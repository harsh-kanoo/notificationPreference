const router = require("express").Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const {
  getCampaigns,
  downloadCampaignRecipients,
} = require("../controllers/viewer.controller");

router.get(
  "/campaigns",
  authenticate,
  authorize("VIEWER", "ADMIN"),
  getCampaigns
);

router.get(
  "/campaigns/:campaignId/recipients",
  authenticate,
  authorize("VIEWER", "ADMIN"),
  downloadCampaignRecipients
);

module.exports = router;

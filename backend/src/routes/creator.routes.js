const router = require("express").Router();
const multer = require("multer");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  bulkUploadUsers,
  createCampaign,
  updateCampaign,
  getCreatorCampaigns,
} = require("../controllers/creator.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/users/upload",
  authenticate,
  authorize("CREATOR"),
  upload.single("file"),
  bulkUploadUsers
);

router.post("/campaigns", authenticate, authorize("CREATOR"), createCampaign);

router.put(
  "/campaigns/:campaignId",
  authenticate,
  authorize("CREATOR"),
  updateCampaign
);

router.get(
  "/campaigns",
  authenticate,
  authorize("CREATOR"),
  getCreatorCampaigns
);

module.exports = router;

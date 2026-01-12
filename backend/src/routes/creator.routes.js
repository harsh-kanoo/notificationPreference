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

// multer config (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

/* --------- BULK UPLOAD USERS --------- */
router.post(
  "/users/upload",
  authenticate,
  authorize("CREATOR"),
  upload.single("file"),
  bulkUploadUsers
);

/* --------- CREATE CAMPAIGN --------- */
router.post("/campaigns", authenticate, authorize("CREATOR"), createCampaign);

/* --------- UPDATE CAMPAIGN (DRAFT ONLY) --------- */
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

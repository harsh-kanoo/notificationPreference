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
  authorize("CREATOR", "ADMIN"),
  upload.single("file"),
  bulkUploadUsers
);

router.post(
  "/campaigns",
  authenticate,
  authorize("CREATOR", "ADMIN"),
  createCampaign
);

router.put(
  "/campaigns/:campaignId",
  authenticate,
  authorize("CREATOR", "ADMIN"),
  updateCampaign
);

router.get(
  "/campaigns",
  authenticate,
  authorize("CREATOR", "ADMIN"),
  getCreatorCampaigns
);

module.exports = router;

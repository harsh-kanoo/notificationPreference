const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const {
  getUsers,
  getCampaigns,
  getAllOrders,
  updateOrderStatus,
  updateUserStatus,
} = require("../controllers/admin.controller");
const { createStaff } = require("../controllers/addStaff.controller");

router.get("/users", authenticate, authorize("ADMIN"), getUsers);
router.get("/campaigns", authenticate, authorize("ADMIN"), getCampaigns);
router.post("/addStaff", authenticate, authorize("ADMIN"), createStaff);
router.get("/orders", authenticate, authorize("ADMIN"), getAllOrders);
router.put("/orders/:id", authenticate, authorize("ADMIN"), updateOrderStatus);
router.put("/user/:id", authenticate, authorize("ADMIN"), updateUserStatus);

module.exports = router;

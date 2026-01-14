const prisma = require("../config/prisma");

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

const getAllOrders = async (req, res) => {
  try {
    console.log("inside admin orders");
    const orders = await prisma.orders.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch all orders",
      error: err.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.orders.update({
      where: { order_id: id },
      data: { status: status },
    });

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  getUsers,
  getCampaigns,
  getAllOrders,
  updateOrderStatus,
};

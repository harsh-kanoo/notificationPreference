const prisma = require("../config/prisma");
const { v4: uuidv4 } = require("uuid");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        user_id: true,
        name: true,
        email: true,
        city: true,
        phone: true,
        preference: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { offers, order_updates, newsletter } = req.body;

    const updatedPreference = await prisma.preference.update({
      where: { user_id: req.user.user_id },
      data: {
        offers,
        order_updates,
        newsletter,
      },
    });

    res.json({
      message: "Preferences updated successfully",
      data: updatedPreference,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update preferences" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const logs = await prisma.notification_logs.findMany({
      where: { user_id: req.user.user_id },
      include: {
        campaign: {
          select: {
            campaign_name: true,
            notification_type: true,
          },
        },
      },
      orderBy: { sent_at: "desc" },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.user_id;

    const product = await prisma.product.findUnique({
      where: { product_id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newOrder = await prisma.orders.create({
      data: {
        order_id: uuidv4(),
        user_id: user_id,
        product_id: product_id,
        status: "PROCESSING",
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const orders = await prisma.orders.findMany({
      where: { user_id: user_id },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching your orders" });
  }
};

module.exports = {
  getProfile,
  updatePreferences,
  getNotifications,
  placeOrder,
  getMyOrders,
};

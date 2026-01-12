const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, city, gender } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user AND their default preferences in a Transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          user_id: uuidv4(),
          name,
          email,
          password: hashedPassword,
          phone,
          city,
          gender,
        },
      });

      // FIXED: Ensure the field names match your schema.prisma
      await tx.preference.create({
        data: {
          preference_id: uuidv4(),
          user_id: user.user_id,
          offers: "OFF",
          order_updates: "OFF",
          newsletter: "OFF",
        },
      });

      return user;
    });

    // 4. Generate JWT Token (for auto-login)
    const token = jwt.sign(
      { user_id: newUser.user_id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: newUser.user_id, name: newUser.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { user_id: user.user_id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.user_id, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    // req.user comes from the middleware we'll check next
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        name: true,
        email: true,
        city: true,
        gender: true,
        phone: true,
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

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, city, gender, phone } = req.body;

    const updatedUser = await prisma.users.update({
      where: { user_id: req.user.user_id },
      data: { name, city, gender, phone },
    });

    res.json({ message: "Profile updated!", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// Get Preferences
const getPreferences = async (req, res) => {
  try {
    const prefs = await prisma.preference.findUnique({
      where: { user_id: req.user.user_id },
    });
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching preferences" });
  }
};

// Update Preferences
const updatePreferences = async (req, res) => {
  try {
    const { offers, order_updates, newsletter } = req.body;

    const updated = await prisma.preference.update({
      where: { user_id: req.user.user_id },
      data: {
        offers, // This will now be a string like "EMAIL,SMS"
        order_updates,
        newsletter,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(500).json({ message: "Error updating preferences" });
  }
};

const getPushNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("Checking notifications for:", userId);

    // 1. Get user's CSV preferences (e.g., "EMAIL,PUSH")
    const userPrefs = await prisma.preference.findUnique({
      where: { user_id: userId },
    });
    console.log("User Offers Pref:", userPrefs?.offers);

    // 2. Get all successful logs and include the campaign details
    const logs = await prisma.notification_logs.findMany({
      where: { user_id: userId, status: "SUCCESS" },
      include: { campaign: true },
      orderBy: { sent_at: "desc" },
    });
    console.log("Total logs found in DB:", logs.length);

    // 3. Filter only for types where the user has "PUSH" in their string
    const pushOnly = logs.filter((log) => {
      const type = log.campaign.notification_type; // e.g., 'OFFER'
      if (type === "OFFER") return userPrefs.offers?.includes("PUSH");
      if (type === "ORDER_UPDATE")
        return userPrefs.order_updates?.includes("PUSH");
      if (type === "NEWSLETTER") return userPrefs.newsletter?.includes("PUSH");
      return false;
    });

    res.json(pushOnly);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add to module.exports
module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getPushNotifications,
};

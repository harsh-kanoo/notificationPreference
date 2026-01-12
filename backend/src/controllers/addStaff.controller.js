const staffService = require("../services/addStaff.service");

async function createStaff(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const staff = await staffService.createStaff({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createStaff,
};

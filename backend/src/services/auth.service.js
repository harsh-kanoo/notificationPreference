const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginStaff = async (email, password) => {
  const staff = await prisma.staff.findUnique({
    where: { email },
  });

  if (!staff) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, staff.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      staff_id: staff.staff_id,
      role: staff.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    staff: {
      staff_id: staff.staff_id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    },
  };
};

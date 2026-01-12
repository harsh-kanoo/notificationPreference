const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function createStaff({ name, email, password, role }) {
  if (!["CREATOR", "VIEWER"].includes(role)) {
    throw new Error("Invalid role");
  }

  const existing = await prisma.staff.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await prisma.staff.create({
    data: {
      staff_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return {
    staff_id: staff.staff_id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  };
}

module.exports = {
  createStaff,
};

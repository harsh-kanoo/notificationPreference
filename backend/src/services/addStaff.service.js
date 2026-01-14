const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function createStaff({
  name,
  email,
  password,
  role,
  gender,
  city,
  phone,
}) {
  if (!["CREATOR", "VIEWER"].includes(role)) {
    throw new Error("Invalid role");
  }

  const existing = await prisma.users.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await prisma.users.create({
    data: {
      user_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      city,
      phone,
    },
  });

  return {
    user_id: staff.user_id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    gender: staff.gender,
    phone: staff.phone,
    city: staff.city,
  };
}

module.exports = {
  createStaff,
};

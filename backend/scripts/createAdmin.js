require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  console.log("Running createAdmin script");

  const email = "superUser@gmail.com";
  const plainPassword = "Admin@123";

  const existing = await prisma.staff.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.staff.create({
    data: {
      staff_id: uuidv4(),
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully");
  console.log("Email:", email);
  console.log("Password:", plainPassword);
}

main()
  .catch((err) => {
    console.error("Error creating admin:", err);
  })
  .finally(() => {
    prisma.$disconnect();
  });

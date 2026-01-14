const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const signup = async (data) => {
  const { name, email, password, phone, city, gender } = data;
  console.log(name, email, password, phone, city, gender);
  if (!name || !email || !password || !phone || !city || !gender) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.users.create({
      data: {
        user_id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        phone,
        city,
        gender,
        role: "CUSTOMER",
      },
    });

    await tx.preference.create({
      data: {
        preference_id: uuidv4(),
        user_id: newUser.user_id,
        offers: "OFF",
        order_updates: "OFF",
        newsletter: "OFF",
      },
    });

    return newUser;
  });

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "Signup successful",
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      gender: user.gender,
      role: user.role,
    },
  };
};

const login = async (email, password) => {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user || !user.is_active) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      gender: user.gender,
      role: user.role,
    },
  };
};

module.exports = { signup, login };
